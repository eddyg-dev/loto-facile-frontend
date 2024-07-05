import { TirageNumber } from './grid-full';

export interface Grid {
  id?: string;
  numero: string;
  quines: TirageNumber[][];
  isSelectedForPlay: boolean;
  isSelectedForEdit: boolean;
  isQuine: boolean;
  isDoubleQuine: boolean;
  isCartonPlein: boolean;
  categoryId: string;
  ss;
}
