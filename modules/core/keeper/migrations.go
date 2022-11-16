package keeper

import (
	sdk "github.com/cosmos/cosmos-sdk/types"

	clientkeeper "github.com/cosmos/ibc-go/v6/modules/core/02-client/keeper"
)

// Migrator is a struct for handling in-place store migrations.
type Migrator struct {
	keeper Keeper
}

// NewMigrator returns a new Migrator.
func NewMigrator(keeper Keeper) Migrator {
	return Migrator{keeper: keeper}
}

// Migrate2to3 migrates from version 2 to 3.
// This migration performs 02-client migrations.
func (m Migrator) Migrate1to2(ctx sdk.Context) error {
	clientMigrator := clientkeeper.NewMigrator(m.keeper.ClientKeeper)
	if err := clientMigrator.Migrate2to3(ctx); err != nil {
		return err
	}

	return nil
}
