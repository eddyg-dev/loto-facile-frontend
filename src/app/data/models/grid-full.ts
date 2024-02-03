import { GridType } from '../enum/grid-type.enum';

export interface GridFullNumber {
  numero?: number;
  x: number;
  y: number;
}

export interface GridFull {
  matrix: number[][];
  numero: number;
  type: GridType;
}
