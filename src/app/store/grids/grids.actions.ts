import { Grid } from 'src/app/data/models/grid';

export class GetGridsAction {
  static readonly type = '[Grids] Get Grids';
}

export class AddGridsAction {
  static readonly type = '[Grids] Add Grids';
  constructor(public grids: Grid[]) {}
}

export class EditGridsAction {
  static readonly type = '[Grids] Edit Grids';
  constructor(public grids: Grid[]) {}
}
export class DeleteGridAction {
  static readonly type = '[Grids] Delete Grid';
  constructor(public gridId: string) {}
}
export class DeleteGridsAction {
  static readonly type = '[Grids] Delete Grids';
  constructor(public gridIds: string[]) {}
}

export class DeleteAllGridsAction {
  static readonly type = '[Grids] Delete All Grids';
}

export class EditGridAction {
  static readonly type = '[Grids] Edit Grid';
  constructor(public editedGrid: Grid) {}
}

export class UnselectAllGridsAction {
  static readonly type = '[Grids] Uneselect All Grids';
}
