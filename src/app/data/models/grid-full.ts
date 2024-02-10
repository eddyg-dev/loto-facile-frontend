export interface GridFullNumber {
  numero: number;
  x: number;
  y: number;
}

export interface GridFull {
  matrix: TirageNumber[][];
  numero: number;
  categoryId: string;
  isQuine1: boolean;
  isQuine2: boolean;
  isQuine3: boolean;
  isQuine: boolean;
  isDoubleQuine: boolean;
  isCartonPlein: boolean;
}

export interface TirageNumber {
  number: number;
  isDrawed: boolean;
}
