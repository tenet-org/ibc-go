package ibctesting

import (
	"testing"

	"github.com/stretchr/testify/require"
	abci "github.com/tendermint/tendermint/abci/types"
	tmtypes "github.com/tendermint/tendermint/types"
)

// ApplyValSetChanges takes in tmtypes.ValidatorSet and []abci.ValidatorUpdate and will return a new tmtypes.ValidatorSet which has the
// provided validator updates applied to the provided validator set.
func ApplyValSetChanges(tb testing.TB, valSet *tmtypes.ValidatorSet, valUpdates []abci.ValidatorUpdate) *tmtypes.ValidatorSet {
	updates, err := tmtypes.PB2TM.ValidatorUpdates(valUpdates)
	require.NoError(tb, err)

	// must copy since validator set will mutate with UpdateWithChangeSet
	newVals := valSet.Copy()
	err = newVals.UpdateWithChangeSet(updates)
	require.NoError(tb, err)

	return newVals
}
