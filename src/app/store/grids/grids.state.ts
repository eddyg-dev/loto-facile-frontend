import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StateKey } from 'src/app/data/enum/state-key.enum';
import { Grid } from 'src/app/data/models/grid';
import {
  AddGridsAction,
  DeleteAllGridsAction,
  DeleteGridAction,
  DeleteGridsAction,
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
    const newGrids = context.getState().grids;
    action.grids.forEach((newGrid) => {
      const index = newGrids.findIndex((g) => g.id === newGrid.id);
      if (index > -1) {
        newGrids[index] = { ...newGrid };
      }
    });
    context.patchState({
      grids: [...newGrids],
    });
  }

  @Action(DeleteGridsAction)
  deleteGrids(
    context: StateContext<GridStateModel>,
    action: DeleteGridsAction
  ): void {
    const newgrids = context
      .getState()
      .grids.filter((g) => !(g.id && action.gridIds.includes(g.id)));
    context.patchState({
      grids: [...newgrids],
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
        grid.isSelectedForPlay = false;
        grid.isSelectedForEdit = false;
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

  @Action(DeleteGridAction)
  deleteCategory(
    context: StateContext<GridStateModel>,
    action: DeleteGridAction
  ): void {
    const index = context
      .getState()
      .grids.findIndex((g) => g.id === action.gridId);

    const newGrids = [...context.getState().grids];
    newGrids.splice(index, 1);
    context.patchState({
      grids: [...newGrids],
    });
  }
}
