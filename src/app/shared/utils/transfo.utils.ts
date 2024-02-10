import { Grid } from 'src/app/data/models/grid';
import {
  GridFull,
  GridFullNumber,
  TirageNumber,
} from 'src/app/data/models/grid-full';

export function gridToGridFull(grid: Grid, tirageNumbers?: number[]): GridFull {
  const gridNumbers: GridFullNumber[] = [];
  grid.quines.forEach((quine, index) => {
    quine.forEach((tirageNumber) => {
      let gridFullNumber: GridFullNumber = {
        x: index,
        y: getSpecifiDizaine(tirageNumber.number),
        numero: tirageNumber.number,
      };
      gridNumbers.push(gridFullNumber);
    });
  });

  const matrix: TirageNumber[][] = initMatrix();

  gridNumbers.forEach((gridNumber) => {
    matrix[gridNumber.x][gridNumber.y] = {
      number: gridNumber.numero,
      isDrawed: tirageNumbers
        ? tirageNumbers.includes(gridNumber.numero)
        : false,
    } ?? { number: 0, isDrawed: false };
  });

  const isQuine1 = isQuineFull(matrix[0]);
  const isQuine2 = isQuineFull(matrix[1]);
  const isQuine3 = isQuineFull(matrix[2]);
  const isQuine = isQuine1 || isQuine2 || isQuine3;
  const isDoubleQuine =
    (isQuine1 && isQuine2) || (isQuine2 && isQuine3) || (isQuine1 && isQuine3);
  const isCartonPlein = isQuine1 && isQuine2 && isQuine3;
  let gridFull: GridFull = {
    numero: grid.numero,
    categoryId: grid.categoryId,
    matrix,
    isQuine1,
    isQuine2,
    isQuine3,
    isQuine,
    isDoubleQuine,
    isCartonPlein,
  };

  return gridFull;
}

export function isQuineFull(quine: TirageNumber[]): boolean {
  return quine
    .filter((m) => m.number !== 0)
    .every((quine1Number) => quine1Number.isDrawed);
}

export function initMatrix(): TirageNumber[][] {
  let matriceVide: TirageNumber[][] = [];
  for (let i = 0; i < 3; i++) {
    matriceVide[i] = new Array<TirageNumber>(9).fill({
      number: 0,
      isDrawed: false,
    });
  }
  return matriceVide;
}

export function getSpecifiDizaine(number: number): number {
  return number === 90 ? 8 : Math.floor(number / 10);
}
