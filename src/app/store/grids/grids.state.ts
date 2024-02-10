import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { StateKey } from 'src/app/data/enum/state-key.enum';
import { Grid } from 'src/app/data/models/grid';
import {
  AddGridsAction,
  DeleteAllGridsAction,
  EditGridAction,
  EditGridsAction,
  UnselectAllGridsAction,
} from './grids.actions';

export interface GridStateModel {
  grids: Grid[];
}

@State({
  name: StateKey.Grids,
  defaults: {
    grids: [],
  },
})
@Injectable()
export class GridState {
  private store = inject(Store);
  @Selector()
  static getGrids(state: GridStateModel): Grid[] {
    return state.grids;
  }

  @Action(AddGridsAction)
  saveGrids(
    context: StateContext<GridStateModel>,
    action: AddGridsAction
  ): void {
    context.patchState({
      grids: [...context.getState().grids, ...action.grids],
    });
  }

  @Action(EditGridsAction)
  editGrids(
    context: StateContext<GridStateModel>,
    action: EditGridsAction
  ): void {
    action.grids.forEach((grid) => {
      this.store.dispatch(new EditGridAction(grid));
    });
  }

  @Action(EditGridAction)
  editGrid(
    context: StateContext<GridStateModel>,
    action: EditGridAction
  ): void {
    const newGrids = context.getState().grids;
    const gridIndex = newGrids.findIndex((g) => g.id === action.editedGrid.id);
    newGrids[gridIndex] = { ...action.editedGrid };
    context.patchState({
      grids: [...newGrids],
    });
  }

  @Action(UnselectAllGridsAction)
  unselectAllGrids(context: StateContext<GridStateModel>): void {
    context.patchState({
      grids: context.getState().grids.map((grid) => {
        grid.isSelected = false;
        return grid;
      }),
    });
  }
  @Action(DeleteAllGridsAction)
  deleteAllGrids(context: StateContext<GridStateModel>): void {
    context.patchState({
      grids: [],
    });
  }
}
