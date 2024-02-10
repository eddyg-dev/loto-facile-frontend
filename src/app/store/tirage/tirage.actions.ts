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
