export interface GridFullNumber {
  numero: number;
  x: number;
  y: number;
}

export interface GridFull {
  matrix: TirageNumber[][];
  numero: string;
  categoryId: string;
  isQuine1: boolean;
  isQuine2: boolean;
  isQuine3: boolean;
  isQuine: boolean;
  isDoubleQuine: boolean;
  isCartonPlein: boolean;
  remainingNumbers: number;
}

export interface TirageNumber {
  number: number;
  isDrawed: boolean;
}
