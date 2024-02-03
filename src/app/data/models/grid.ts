import { GridType } from '../enum/grid-type.enum';

export interface Grid {
  id: string;
  numero: number;
  quines: number[][];
  type: GridType;
}
