import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Tirage } from 'src/app/data/models/tirage';
import { SaveTirageAction } from './tirage.actions';

export interface TirageStateModel {
  tirage: Tirage;
}

@State({
  name: 'tirage',
  defaults: {
    tirage: undefined,
  },
})
@Injectable()
export class TirageState {
  @Selector()
  static getTirage(state: TirageStateModel): Tirage {
    return state.tirage;
  }

  @Action(SaveTirageAction)
  saveTirage(
    context: StateContext<TirageStateModel>,
    action: SaveTirageAction
  ): void {
    context.patchState({
      tirage: action.tirage,
    });
  }
}
