package v7_test

import (
	"time"

	"github.com/cosmos/ibc-go/v6/modules/core/02-client/migrations/v7"
	"github.com/cosmos/ibc-go/v6/modules/core/02-client/types"
	host "github.com/cosmos/ibc-go/v6/modules/core/24-host"
	"github.com/cosmos/ibc-go/v6/modules/core/exported"
	ibctm "github.com/cosmos/ibc-go/v6/modules/light-clients/07-tendermint"
	ibctesting "github.com/cosmos/ibc-go/v6/testing"
)

// only test migration for solo machines
// ensure all client states are migrated and all consensus states
// are removed
func (suite *MigrationsV7TestSuite) TestMigrateStoreSolomachine() {
	path := ibctesting.NewPath(suite.chainA, suite.chainB)

	// create multiple legacy solo machine clients
	solomachine := ibctesting.NewSolomachine(suite.T(), suite.chainA.Codec, "06-solomachine-0", "testing", 1)
	solomachineMulti := ibctesting.NewSolomachine(suite.T(), suite.chainA.Codec, "06-solomachine-1", "testing", 4)

	// manually generate old proto buf definitions and set in store
	// NOTE: we cannot use 'CreateClient' and 'UpdateClient' functions since we are
	// using client states and consensus states which do not implement the exported.ClientState
	// and exported.ConsensusState interface
	for _, sm := range []*ibctesting.Solomachine{solomachine, solomachineMulti} {
		clientStore := suite.chainA.App.GetIBCKeeper().ClientKeeper.ClientStore(suite.chainA.GetContext(), sm.ClientID)
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
		bz, err := suite.chainA.App.AppCodec().MarshalInterface(legacyClientState)
		suite.Require().NoError(err)
		clientStore.Set(host.ClientStateKey(), bz)

		// set some consensus states
		height1 := types.NewHeight(0, 1)
		height2 := types.NewHeight(1, 2)
		height3 := types.NewHeight(0, 123)

		bz, err = suite.chainA.App.AppCodec().MarshalInterface(legacyClientState.ConsensusState)
		suite.Require().NoError(err)
		clientStore.Set(host.ConsensusStateKey(height1), bz)
		clientStore.Set(host.ConsensusStateKey(height2), bz)
		clientStore.Set(host.ConsensusStateKey(height3), bz)
	}

	// create tendermint clients
	suite.coordinator.SetupClients(path)

	err := v7.MigrateStore(suite.chainA.GetContext(), suite.chainA.GetSimApp().GetKey(host.StoreKey), suite.chainA.App.AppCodec())
	suite.Require().NoError(err)

	// verify client state has been migrated
	for _, sm := range []*ibctesting.Solomachine{solomachine, solomachineMulti} {
		clientState, ok := suite.chainA.App.GetIBCKeeper().ClientKeeper.GetClientState(suite.chainA.GetContext(), sm.ClientID)
		suite.Require().True(ok)
		suite.Require().Equal(sm.ClientState(), clientState)
	}

	// verify consensus states have been removed
	for _, sm := range []*ibctesting.Solomachine{solomachine, solomachineMulti} {
		clientConsensusStates := suite.chainA.App.GetIBCKeeper().ClientKeeper.GetAllConsensusStates(suite.chainA.GetContext())
		for _, client := range clientConsensusStates {
			// GetAllConsensusStates should not return consensus states for our solo machine clients
			suite.Require().NotEqual(sm.ClientID, client.ClientId)
		}
	}
}

// only test migration for tendermint clients
// ensure all expired consensus states are removed from tendermint client stores
func (suite *MigrationsV7TestSuite) TestMigrateStoreTendermint() {
	// create path and setup clients
	path1 := ibctesting.NewPath(suite.chainA, suite.chainB)
	suite.coordinator.SetupClients(path1)

	path2 := ibctesting.NewPath(suite.chainA, suite.chainB)
	suite.coordinator.SetupClients(path2)

	pruneHeightMap := make(map[*ibctesting.Path][]exported.Height)
	unexpiredHeightMap := make(map[*ibctesting.Path][]exported.Height)

	for _, path := range []*ibctesting.Path{path1, path2} {
		// collect all heights expected to be pruned
		var pruneHeights []exported.Height
		pruneHeights = append(pruneHeights, path.EndpointA.GetClientState().GetLatestHeight())

		// these heights will be expired and also pruned
		for i := 0; i < 3; i++ {
			path.EndpointA.UpdateClient()
			pruneHeights = append(pruneHeights, path.EndpointA.GetClientState().GetLatestHeight())
		}

		// double chedck all information is currently stored
		for _, pruneHeight := range pruneHeights {
			consState, ok := suite.chainA.GetConsensusState(path.EndpointA.ClientID, pruneHeight)
			suite.Require().True(ok)
			suite.Require().NotNil(consState)

			ctx := suite.chainA.GetContext()
			clientStore := suite.chainA.App.GetIBCKeeper().ClientKeeper.ClientStore(ctx, path.EndpointA.ClientID)

			processedTime, ok := ibctm.GetProcessedTime(clientStore, pruneHeight)
			suite.Require().True(ok)
			suite.Require().NotNil(processedTime)

			processedHeight, ok := ibctm.GetProcessedHeight(clientStore, pruneHeight)
			suite.Require().True(ok)
			suite.Require().NotNil(processedHeight)

			expectedConsKey := ibctm.GetIterationKey(clientStore, pruneHeight)
			suite.Require().NotNil(expectedConsKey)
		}
		pruneHeightMap[path] = pruneHeights
	}

	// Increment the time by a week
	suite.coordinator.IncrementTimeBy(7 * 24 * time.Hour)

	for _, path := range []*ibctesting.Path{path1, path2} {
		// create the consensus state that can be used as trusted height for next update
		var unexpiredHeights []exported.Height
		err := path.EndpointA.UpdateClient()
		suite.Require().NoError(err)
		unexpiredHeights = append(unexpiredHeights, path.EndpointA.GetClientState().GetLatestHeight())

		err = path.EndpointA.UpdateClient()
		suite.Require().NoError(err)
		unexpiredHeights = append(unexpiredHeights, path.EndpointA.GetClientState().GetLatestHeight())

		unexpiredHeightMap[path] = unexpiredHeights
	}

	// Increment the time by another week, then update the client.
	// This will cause the consensus states created before the first time increment
	// to be expired
	suite.coordinator.IncrementTimeBy(7 * 24 * time.Hour)
	err := v7.MigrateStore(path1.EndpointA.Chain.GetContext(), path1.EndpointA.Chain.GetSimApp().GetKey(host.StoreKey), path1.EndpointA.Chain.App.AppCodec())
	suite.Require().NoError(err)

	for _, path := range []*ibctesting.Path{path1, path2} {
		ctx := suite.chainA.GetContext()
		clientStore := suite.chainA.App.GetIBCKeeper().ClientKeeper.ClientStore(ctx, path.EndpointA.ClientID)

		// ensure everything has been pruned
		for i, pruneHeight := range pruneHeightMap[path] {
			consState, ok := suite.chainA.GetConsensusState(path.EndpointA.ClientID, pruneHeight)
			suite.Require().False(ok, i)
			suite.Require().Nil(consState, i)

			processedTime, ok := ibctm.GetProcessedTime(clientStore, pruneHeight)
			suite.Require().False(ok, i)
			suite.Require().Equal(uint64(0), processedTime, i)

			processedHeight, ok := ibctm.GetProcessedHeight(clientStore, pruneHeight)
			suite.Require().False(ok, i)
			suite.Require().Nil(processedHeight, i)

			expectedConsKey := ibctm.GetIterationKey(clientStore, pruneHeight)
			suite.Require().Nil(expectedConsKey, i)
		}

		// ensure metadata is set for unexpired consensus state
		for _, height := range unexpiredHeightMap[path] {
			consState, ok := suite.chainA.GetConsensusState(path.EndpointA.ClientID, height)
			suite.Require().True(ok)
			suite.Require().NotNil(consState)

			processedTime, ok := ibctm.GetProcessedTime(clientStore, height)
			suite.Require().True(ok)
			suite.Require().NotEqual(uint64(0), processedTime)

			processedHeight, ok := ibctm.GetProcessedHeight(clientStore, height)
			suite.Require().True(ok)
			suite.Require().NotEqual(types.ZeroHeight(), processedHeight)

			consKey := ibctm.GetIterationKey(clientStore, height)
			suite.Require().Equal(host.ConsensusStateKey(height), consKey)
		}
	}
}
