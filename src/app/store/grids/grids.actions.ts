import { Grid } from 'src/app/data/models/grid';

export class GetGridsAction {
  static readonly type = '[Grids] Get Grids';
}

export class SaveGridsAction {
  static readonly type = '[Grids] Save Grids';
  constructor(public grids: Grid[]) {}
}
