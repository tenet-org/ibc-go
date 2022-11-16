package v7_test

import (
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/suite"

	"github.com/cosmos/ibc-go/v6/modules/core/02-client/migrations/v7"
	clienttypes "github.com/cosmos/ibc-go/v6/modules/core/02-client/types"
	host "github.com/cosmos/ibc-go/v6/modules/core/24-host"
	ibctesting "github.com/cosmos/ibc-go/v6/testing"
)

type MigrationsV7TestSuite struct {
	suite.Suite

	coordinator *ibctesting.Coordinator

	chainA *ibctesting.TestChain
	chainB *ibctesting.TestChain
}

func (suite *MigrationsV7TestSuite) SetupTest() {
	suite.coordinator = ibctesting.NewCoordinator(suite.T(), 2)

	suite.chainA = suite.coordinator.GetChain(ibctesting.GetChainID(1))
	suite.chainB = suite.coordinator.GetChain(ibctesting.GetChainID(2))
}

func TestIBCTestSuite(t *testing.T) {
	suite.Run(t, new(MigrationsV7TestSuite))
}

func (suite *MigrationsV7TestSuite) TestMigrateToV7() {
	var clientStore sdk.KVStore

	testCases := []struct {
		name     string
		malleate func()
	}{
		{
			"success: prune localhost client state",
			func() {
				clientStore.Set(host.ClientStateKey(), []byte("clientState"))
			},
		},
		{
			"success: prune localhost client state and consensus states",
			func() {
				clientStore.Set(host.ClientStateKey(), []byte("clientState"))

				for i := 0; i < 10; i++ {
					clientStore.Set(host.ConsensusStateKey(clienttypes.NewHeight(1, uint64(i))), []byte("consensusState"))
				}
			},
		},
	}

	for _, tc := range testCases {
		tc := tc

		suite.Run(tc.name, func() {
			suite.SetupTest() // reset

			clientStore = suite.chainA.GetSimApp().IBCKeeper.ClientKeeper.ClientStore(suite.chainA.GetContext(), v7.Localhost)

			tc.malleate()

			err := v7.MigrateStore(suite.chainA.GetContext(), suite.chainA.GetSimApp().GetKey(host.StoreKey), suite.chainA.App.AppCodec())
			suite.Require().NoError(err)

			suite.Require().False(clientStore.Has(host.ClientStateKey()))

			for i := 0; i < 10; i++ {
				suite.Require().False(clientStore.Has(host.ConsensusStateKey(clienttypes.NewHeight(1, uint64(i)))))
			}
		})
	}
}
