import { TirageType } from 'src/app/data/enum/tirage-type.enum';
import { Grid } from 'src/app/data/models/grid';
import {
  GridFull,
  GridFullNumber,
  TirageNumber,
} from 'src/app/data/models/grid-full';

export function gridToGridFull(
  grid: Grid,
  tirageNumbers?: number[],
  tirageType?: TirageType
): GridFull {
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

  let remainingNumbers = 0;
  if (tirageType) {
    switch (tirageType) {
      case TirageType.Quine:
        if (!isQuine) {
          const numbersInQuine1 = getNumbersInQuine(matrix[0]);
          const numbersInQuine2 = getNumbersInQuine(matrix[1]);
          const numbersInQuine3 = getNumbersInQuine(matrix[2]);

          const drawedInQuine1 = getDrawedNumbersCount([matrix[0]]);
          const drawedInQuine2 = getDrawedNumbersCount([matrix[1]]);
          const drawedInQuine3 = getDrawedNumbersCount([matrix[2]]);

          const remainingByQuine = [
            numbersInQuine1 - drawedInQuine1,
            numbersInQuine2 - drawedInQuine2,
            numbersInQuine3 - drawedInQuine3,
          ];

          remainingNumbers = Math.min(...remainingByQuine.filter((n) => n > 0));
        }
        break;

      case TirageType.Double_Quine:
        if (!isDoubleQuine) {
          const completedQuines = [isQuine1, isQuine2, isQuine3].filter(
            (q) => q
          ).length;
          const remainingByQuine = [
            getNumbersInQuine(matrix[0]) - getDrawedNumbersCount([matrix[0]]),
            getNumbersInQuine(matrix[1]) - getDrawedNumbersCount([matrix[1]]),
            getNumbersInQuine(matrix[2]) - getDrawedNumbersCount([matrix[2]]),
          ];

          if (completedQuines === 1) {
            remainingNumbers = Math.min(
              ...remainingByQuine.filter((n) => n > 0)
            );
          } else {
            const sortedRemaining = remainingByQuine
              .filter((n) => n > 0)
              .sort((a, b) => a - b);
            remainingNumbers =
              sortedRemaining.length >= 2
                ? sortedRemaining[0] + sortedRemaining[1]
                : sortedRemaining[0] || 0;
          }
        }
        break;

      case TirageType.Carton_Plein:
        if (!isCartonPlein) {
          const remainingByQuine = [
            getNumbersInQuine(matrix[0]) - getDrawedNumbersCount([matrix[0]]),
            getNumbersInQuine(matrix[1]) - getDrawedNumbersCount([matrix[1]]),
            getNumbersInQuine(matrix[2]) - getDrawedNumbersCount([matrix[2]]),
          ];
          remainingNumbers = remainingByQuine.reduce((a, b) => a + b, 0);
        }
        break;
    }
  }

  let nextWinningNumber: number | undefined;
  if (remainingNumbers === 1) {
    switch (tirageType) {
      case TirageType.Quine:
        nextWinningNumber = findNextWinningNumberForQuine(matrix);
        break;
      case TirageType.Double_Quine:
        nextWinningNumber = findNextWinningNumberForDoubleQuine(matrix, [
          isQuine1,
          isQuine2,
          isQuine3,
        ]);
        break;
      case TirageType.Carton_Plein:
        nextWinningNumber = findNextWinningNumberForCartonPlein(matrix);
        break;
    }
  }

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
    remainingNumbers,
    nextWinningNumber,
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

function getNumbersInQuine(quine: TirageNumber[]): number {
  return quine.filter((n) => n.number !== 0).length;
}

function getDrawedNumbersCount(quines: TirageNumber[][]): number {
  let count = 0;
  for (const quine of quines) {
    for (const number of quine) {
      if (number.number !== 0 && number.isDrawed) {
        count++;
      }
    }
  }
  return count;
}

function findNextWinningNumberForQuine(
  matrix: TirageNumber[][]
): number | undefined {
  for (const quine of matrix) {
    const nonDrawedNumbers = quine.filter((n) => n.number !== 0 && !n.isDrawed);
    if (nonDrawedNumbers.length === 1) {
      return nonDrawedNumbers[0].number;
    }
  }
  return undefined;
}

function findNextWinningNumberForDoubleQuine(
  matrix: TirageNumber[][],
  quineStates: boolean[]
): number | undefined {
  const completedQuines = quineStates.filter((q) => q).length;
  if (completedQuines === 1) {
    // Chercher dans les quines non complétées
    for (let i = 0; i < matrix.length; i++) {
      if (!quineStates[i]) {
        const nonDrawedNumbers = matrix[i].filter(
          (n) => n.number !== 0 && !n.isDrawed
        );
        if (nonDrawedNumbers.length === 1) {
          return nonDrawedNumbers[0].number;
        }
      }
    }
  }
  return undefined;
}

function findNextWinningNumberForCartonPlein(
  matrix: TirageNumber[][]
): number | undefined {
  for (const quine of matrix) {
    const nonDrawedNumbers = quine.filter((n) => n.number !== 0 && !n.isDrawed);
    if (nonDrawedNumbers.length === 1) {
      return nonDrawedNumbers[0].number;
    }
  }
  return undefined;
}
