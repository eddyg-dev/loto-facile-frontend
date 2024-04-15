import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StateKey } from 'src/app/data/enum/state-key.enum';
import { TirageMode } from 'src/app/data/enum/tirage-mode.enum';
import {
  AddNumberTirageAction,
  ClearTirageAction,
  DeleteNumberTirageAction,
  SetTirageModeAction,
  SetWinFirstQuineAction,
  SetWinSecondQuineAction,
  SetWinThirdQuineAction,
} from './tirage.actions';

export interface TirageStateModel {
  numbers: number[];
  winFirstQuine: string[];
  winSecondQuine: string[];
  winThirdQuine: string[];
  tirageMode: TirageMode;
}

@State<TirageStateModel>({
  name: StateKey.Tirage,
  defaults: {
    numbers: [],
    winFirstQuine: [],
    winSecondQuine: [],
    winThirdQuine: [],
    tirageMode: TirageMode.INITIAL,
  },
})
@Injectable()
export class TirageState {
  @Selector()
  static getTirageMode(state: TirageStateModel): TirageMode {
    return state.tirageMode;
  }
  @Selector()
  static getTirageNumbers(state: TirageStateModel): number[] {
    return state.numbers;
  }

  @Selector()
  static getWinFirstQuine(state: TirageStateModel): string[] {
    return state.winFirstQuine;
  }
  @Selector()
  static getWinSecondQuine(state: TirageStateModel): string[] {
    return state.winSecondQuine;
  }
  @Selector()
  static getWinThirdQuine(state: TirageStateModel): string[] {
    return state.winThirdQuine;
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
      winFirstQuine: [],
      winSecondQuine: [],
      winThirdQuine: [],
    });
  }

  @Action(SetWinFirstQuineAction)
  setWinFirstQuine(
    context: StateContext<TirageStateModel>,
    action: SetWinFirstQuineAction
  ): void {
    const state = context.getState();
    context.setState({
      ...state,
      winFirstQuine: [...state.winFirstQuine, ...action.gridsIds],
    });
  }

  @Action(SetWinSecondQuineAction)
  setWinSecondQuine(
    context: StateContext<TirageStateModel>,
    action: SetWinSecondQuineAction
  ): void {
    const state = context.getState();
    context.setState({
      ...state,
      winSecondQuine: [...state.winSecondQuine, ...action.gridsIds],
    });
  }
  @Action(SetWinThirdQuineAction)
  setWinThirdQuine(
    context: StateContext<TirageStateModel>,
    action: SetWinThirdQuineAction
  ): void {
    const state = context.getState();
    context.setState({
      ...state,
      winThirdQuine: [...state.winThirdQuine, ...action.gridsIds],
    });
  }
  @Action(SetTirageModeAction)
  setTirageMode(
    context: StateContext<TirageStateModel>,
    action: SetTirageModeAction
  ): void {
    const state = context.getState();
    context.setState({
      ...state,
      tirageMode: action.tirageMode,
    });
  }
}
