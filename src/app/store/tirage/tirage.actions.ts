import { Tirage } from 'src/app/data/models/tirage';

export class GetTirageAction {
  static readonly type = '[Tirage] Get Tirage';
}

export class SaveTirageAction {
  static readonly type = '[Tirage] Save Tirage';
  constructor(public tirage: Tirage) {}
}
