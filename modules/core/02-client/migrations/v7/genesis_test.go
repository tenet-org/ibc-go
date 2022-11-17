package v7_test

import (
	"encoding/json"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/codec"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"

	ibcclient "github.com/cosmos/ibc-go/v6/modules/core/02-client"
	"github.com/cosmos/ibc-go/v6/modules/core/02-client/migrations/v7"
	"github.com/cosmos/ibc-go/v6/modules/core/02-client/types"
	host "github.com/cosmos/ibc-go/v6/modules/core/24-host"
	ibctesting "github.com/cosmos/ibc-go/v6/testing"
	"github.com/cosmos/ibc-go/v6/testing/simapp"
)

func (suite *MigrationsV7TestSuite) TestMigrateGenesisSolomachine() {
	encodingConfig := simapp.MakeTestEncodingConfig()
	clientCtx := client.Context{}.
		WithInterfaceRegistry(encodingConfig.InterfaceRegistry).
		WithTxConfig(encodingConfig.TxConfig).
		WithCodec(encodingConfig.Marshaler)

	// create tendermint clients
	for i := 0; i < 3; i++ {
		path := ibctesting.NewPath(suite.chainA, suite.chainB)

		suite.coordinator.SetupClients(path)

		err := path.EndpointA.UpdateClient()
		suite.Require().NoError(err)
		err = path.EndpointA.UpdateClient()
		suite.Require().NoError(err)
	}

	// create multiple legacy solo machine clients
	solomachine := ibctesting.NewSolomachine(suite.T(), suite.chainA.Codec, "06-solomachine-0", "testing", 1)
	solomachineMulti := ibctesting.NewSolomachine(suite.T(), suite.chainA.Codec, "06-solomachine-1", "testing", 4)

	clientGenState := ibcclient.ExportGenesis(suite.chainA.GetContext(), suite.chainA.App.GetIBCKeeper().ClientKeeper)

	// manually generate old proto buf definitions and set in genesis
	// NOTE: we cannot use 'ExportGenesis' for the solo machines since we are
	// using client states and consensus states which do not implement the exported.ClientState
	// and exported.ConsensusState interface
	var clients []types.IdentifiedClientState
	for _, sm := range []*ibctesting.Solomachine{solomachine, solomachineMulti} {
		clientState := sm.ClientState()

		// generate old client state proto definition
		legacyClientState := &v7.ClientState{
			Sequence: clientState.Sequence,
			ConsensusState: &v7.ConsensusState{
				PublicKey:   clientState.ConsensusState.PublicKey,
				Diversifier: clientState.ConsensusState.Diversifier,
				Timestamp:   clientState.ConsensusState.Timestamp,
			},
			AllowUpdateAfterProposal: true,
		}

		// set client state
		any, err := codectypes.NewAnyWithValue(legacyClientState)
		suite.Require().NoError(err)
		suite.Require().NotNil(any)
		client := types.IdentifiedClientState{
			ClientId:    sm.ClientID,
			ClientState: any,
		}
		clients = append(clients, client)

		// set in store for ease of determining expected genesis
		clientStore := suite.chainA.App.GetIBCKeeper().ClientKeeper.ClientStore(suite.chainA.GetContext(), sm.ClientID)
		bz, err := suite.chainA.App.AppCodec().MarshalInterface(legacyClientState)
		suite.Require().NoError(err)
		clientStore.Set(host.ClientStateKey(), bz)

		// set some consensus states
		height1 := types.NewHeight(0, 1)
		height2 := types.NewHeight(1, 2)
		height3 := types.NewHeight(0, 123)

		any, err = codectypes.NewAnyWithValue(legacyClientState.ConsensusState)
		suite.Require().NoError(err)
		suite.Require().NotNil(any)
		consensusState1 := types.ConsensusStateWithHeight{
			Height:         height1,
			ConsensusState: any,
		}
		consensusState2 := types.ConsensusStateWithHeight{
			Height:         height2,
			ConsensusState: any,
		}
		consensusState3 := types.ConsensusStateWithHeight{
			Height:         height3,
			ConsensusState: any,
		}

		clientConsensusState := types.ClientConsensusStates{
			ClientId:        sm.ClientID,
			ConsensusStates: []types.ConsensusStateWithHeight{consensusState1, consensusState2, consensusState3},
		}

		clientGenState.ClientsConsensus = append(clientGenState.ClientsConsensus, clientConsensusState)

		// set in store for ease of determining expected genesis
		bz, err = suite.chainA.App.AppCodec().MarshalInterface(legacyClientState.ConsensusState)
		suite.Require().NoError(err)
		clientStore.Set(host.ConsensusStateKey(height1), bz)
		clientStore.Set(host.ConsensusStateKey(height2), bz)
		clientStore.Set(host.ConsensusStateKey(height3), bz)
	}
	// solo machine clients must come before tendermint in expected
	clientGenState.Clients = append(clients, clientGenState.Clients...)

	// migrate store get expected genesis
	// store migration and genesis migration should produce identical results
	err := v7.MigrateStore(suite.chainA.GetContext(), suite.chainA.GetSimApp().GetKey(host.StoreKey), suite.chainA.App.AppCodec())
	suite.Require().NoError(err)
	expectedClientGenState := ibcclient.ExportGenesis(suite.chainA.GetContext(), suite.chainA.App.GetIBCKeeper().ClientKeeper)

	// NOTE: genesis time isn't updated since we aren't testing for tendermint consensus state pruning
	migrated, err := v7.MigrateGenesis(codec.NewProtoCodec(clientCtx.InterfaceRegistry), &clientGenState, suite.coordinator.CurrentTime, types.GetSelfHeight(suite.chainA.GetContext()))
	suite.Require().NoError(err)

	bz, err := clientCtx.Codec.MarshalJSON(&expectedClientGenState)
	suite.Require().NoError(err)

	// Indent the JSON bz correctly.
	var jsonObj map[string]interface{}
	err = json.Unmarshal(bz, &jsonObj)
	suite.Require().NoError(err)
	expectedIndentedBz, err := json.MarshalIndent(jsonObj, "", "\t")
	suite.Require().NoError(err)

	bz, err = clientCtx.Codec.MarshalJSON(migrated)
	suite.Require().NoError(err)

	// Indent the JSON bz correctly.
	err = json.Unmarshal(bz, &jsonObj)
	suite.Require().NoError(err)
	indentedBz, err := json.MarshalIndent(jsonObj, "", "\t")
	suite.Require().NoError(err)

	suite.Require().Equal(string(expectedIndentedBz), string(indentedBz))
}
