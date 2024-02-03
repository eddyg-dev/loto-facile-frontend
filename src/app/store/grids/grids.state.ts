import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Grid } from 'src/app/data/models/grid';
import { SaveGridsAction } from './grids.actions';
import { GridType } from 'src/app/data/enum/grid-type.enum';

export interface GridStateModel {
  grids: Grid[];
}

@State({
  name: 'grids',
  defaults: {
    grids: [],
  },
})
@Injectable()
export class GridState {
  @Selector()
  static getGrids(state: GridStateModel): Grid[] {
    console.log(state.grids);

    return state.grids;
  }

  @Selector()
  static getGridsByType(state: GridStateModel, type: GridType): Grid[] {
    console.log('v', state.grids);

    return state.grids.filter((grid) => grid.type === 'Loto');
  }

  @Action(SaveGridsAction)
  saveGrids(
    context: StateContext<GridStateModel>,
    action: SaveGridsAction
  ): void {
    context.patchState({
      grids: action.grids,
    });
  }
}
