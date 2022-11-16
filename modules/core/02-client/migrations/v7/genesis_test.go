package v7_test

import (
	"bytes"
	"encoding/json"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/codec"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"

	ibcclient "github.com/cosmos/ibc-go/v6/modules/core/02-client"
	"github.com/cosmos/ibc-go/v6/modules/core/02-client/migrations/v7"
	"github.com/cosmos/ibc-go/v6/modules/core/02-client/types"
	host "github.com/cosmos/ibc-go/v6/modules/core/24-host"
	ibctm "github.com/cosmos/ibc-go/v6/modules/light-clients/07-tendermint"
	ibctesting "github.com/cosmos/ibc-go/v6/testing"
	"github.com/cosmos/ibc-go/v6/testing/simapp"
)

func (suite *MigrationsV7TestSuite) TestMigrateGenesisSolomachine() {
	path := ibctesting.NewPath(suite.chainA, suite.chainB)
	encodingConfig := simapp.MakeTestEncodingConfig()
	clientCtx := client.Context{}.
		WithInterfaceRegistry(encodingConfig.InterfaceRegistry).
		WithTxConfig(encodingConfig.TxConfig).
		WithCodec(encodingConfig.Marshaler)

	// create multiple legacy solo machine clients
	solomachine := ibctesting.NewSolomachine(suite.T(), suite.chainA.Codec, "06-solomachine-0", "testing", 1)
	solomachineMulti := ibctesting.NewSolomachine(suite.T(), suite.chainA.Codec, "06-solomachine-1", "testing", 4)

	// create tendermint clients
	suite.coordinator.SetupClients(path)
	err := path.EndpointA.UpdateClient()
	suite.Require().NoError(err)
	clientGenState := ibcclient.ExportGenesis(path.EndpointA.Chain.GetContext(), path.EndpointA.Chain.App.GetIBCKeeper().ClientKeeper)

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
		clientStore := path.EndpointA.Chain.App.GetIBCKeeper().ClientKeeper.ClientStore(path.EndpointA.Chain.GetContext(), sm.ClientID)
		bz, err := path.EndpointA.Chain.App.AppCodec().MarshalInterface(legacyClientState)
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
		bz, err = path.EndpointA.Chain.App.AppCodec().MarshalInterface(legacyClientState.ConsensusState)
		suite.Require().NoError(err)
		clientStore.Set(host.ConsensusStateKey(height1), bz)
		clientStore.Set(host.ConsensusStateKey(height2), bz)
		clientStore.Set(host.ConsensusStateKey(height3), bz)
	}
	// solo machine clients must come before tendermint in expected
	clientGenState.Clients = append(clients, clientGenState.Clients...)

	// migrate store get expected genesis
	// store migration and genesis migration should produce identical results
	err = v7.MigrateStore(path.EndpointA.Chain.GetContext(), path.EndpointA.Chain.GetSimApp().GetKey(host.StoreKey), path.EndpointA.Chain.App.AppCodec())
	suite.Require().NoError(err)
	expectedClientGenState := ibcclient.ExportGenesis(path.EndpointA.Chain.GetContext(), path.EndpointA.Chain.App.GetIBCKeeper().ClientKeeper)

	// NOTE: genesis time isn't updated since we aren't testing for tendermint consensus state pruning
	migrated, err := v7.MigrateGenesis(codec.NewProtoCodec(clientCtx.InterfaceRegistry), &clientGenState, suite.coordinator.CurrentTime, types.GetSelfHeight(suite.chainA.GetContext()))
	suite.Require().NoError(err)

	// 'ExportGenesis' order metadata keys by processedheight, processedtime for all heights, then it appends all iteration keys
	// In order to match the genesis migration with export genesis (from store migrations) we must reorder the iteration keys to be last
	// This isn't ideal, but it is better than modifying the genesis migration from a previous version to match the export genesis of a new version
	// which provides no benefit except nicer testing
	for i, clientMetadata := range migrated.ClientsMetadata {
		var updatedMetadata []types.GenesisMetadata
		var iterationKeys []types.GenesisMetadata
		for _, metadata := range clientMetadata.ClientMetadata {
			if bytes.HasPrefix(metadata.Key, []byte(ibctm.KeyIterateConsensusStatePrefix)) {
				iterationKeys = append(iterationKeys, metadata)
			} else {
				updatedMetadata = append(updatedMetadata, metadata)
			}
		}
		updatedMetadata = append(updatedMetadata, iterationKeys...)
		migrated.ClientsMetadata[i] = types.IdentifiedGenesisMetadata{
			ClientId:       clientMetadata.ClientId,
			ClientMetadata: updatedMetadata,
		}
	}

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
