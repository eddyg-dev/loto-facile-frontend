import { keypad, square } from 'ionicons/icons';
import { CategoryColor } from '../enum/category-color.enum';
import { TirageType } from '../enum/tirage-type.enum';
import { Category } from '../models/category';
import { TirageParams } from '../models/tirage-params';

export const iconList = {
  keypad,
  square,
};

export const tirageTypeParams: { [key in TirageType]: TirageParams } = {
  [TirageType.Quine]: {
    winNameSingulier: 'Quine gagnante',
    winNamePluriel: 'Quines gagnantes',
  },
  [TirageType.Double_Quine]: {
    winNameSingulier: 'Double-quine gagnante',
    winNamePluriel: 'Double-quines gagnantes',
  },
  [TirageType.Carton_Plein]: {
    winNameSingulier: 'Carton plein gagnant',
    winNamePluriel: 'Cartons pleins gagnants',
  },
};

export const defaultCategories: Category[] = [
  {
    id: '0',
    color: CategoryColor.Red,
    name: 'Loto',
    isDeletable: false,
  },
  {
    id: '1',
    color: CategoryColor.Green,
    name: 'Bingo',
    isDeletable: false,
  },
  {
    id: '2',
    color: CategoryColor.Blue,
    name: 'Traditionnel',
    isDeletable: false,
  },
  {
    id: '3',
    color: CategoryColor.Black,
    name: 'Carton pourri',
    isDeletable: false,
  },
];
