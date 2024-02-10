import { TirageNumber } from './grid-full';

export interface Grid {
  id?: string;
  numero: number;
  quines: TirageNumber[][];
  isSelected: boolean;
  isQuine: boolean;
  isDoubleQuine: boolean;
  isCartonPlein: boolean;
  categoryId: string;
}
