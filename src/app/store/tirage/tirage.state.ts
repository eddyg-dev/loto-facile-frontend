import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StateKey } from 'src/app/data/enum/state-key.enum';
import {
  AddNumberTirageAction,
  ClearTirageAction,
  DeleteNumberTirageAction,
} from './tirage.actions';

export interface TirageStateModel {
  numbers: number[];
}

@State({
  name: StateKey.Tirage,
  defaults: {
    numbers: [],
  },
})
@Injectable()
export class TirageState {
  @Selector()
  static getTirageNumbers(state: TirageStateModel): number[] {
    return state.numbers;
  }

  @Action(AddNumberTirageAction)
  addNumberTirage(
    context: StateContext<TirageStateModel>,
    action: AddNumberTirageAction
  ): void {
    const state = context.getState();
    context.setState({
      ...state,
      numbers: [...state.numbers, action.number],
    });
  }

  @Action(DeleteNumberTirageAction)
  deleteNumberTirage(
    context: StateContext<TirageStateModel>,
    action: DeleteNumberTirageAction
  ): void {
    const state = context.getState();
    context.setState({
      ...state,
      numbers: state.numbers.filter((n) => n !== action.number),
    });
  }

  @Action(ClearTirageAction)
  clearTirage(context: StateContext<TirageStateModel>): void {
    const state = context.getState();
    context.setState({
      ...state,
      numbers: [],
    });
  }
}
