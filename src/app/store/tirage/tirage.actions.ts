import { TirageMode } from 'src/app/data/enum/tirage-mode.enum';

export class GetTirageAction {
  static readonly type = '[Tirage] Get Tirage';
}

export class AddNumberTirageAction {
  static readonly type = '[Tirage] Add Number Tirage';
  constructor(public number: number) {}
}

export class DeleteNumberTirageAction {
  static readonly type = '[Tirage] Delete Number Tirage';
  constructor(public number: number) {}
}

export class ClearTirageAction {
  static readonly type = '[Tirage] Clear Tirage';
}

export class SetTirageModeAction {
  static readonly type = '[Tirage] Set Tirage Mode';
  constructor(public tirageMode: TirageMode) {}
}
export class SetWinFirstQuineAction {
  static readonly type = '[Tirage] Set Win First Quine';
  constructor(public gridsIds: string[]) {}
}
export class SetWinSecondQuineAction {
  static readonly type = '[Tirage] Set Win Second Quine';
  constructor(public gridsIds: string[]) {}
}
export class SetWinThirdQuineAction {
  static readonly type = '[Tirage] Set Win Third Quine';
  constructor(public gridsIds: string[]) {}
}
