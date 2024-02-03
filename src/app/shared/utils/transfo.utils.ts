import { Grid } from 'src/app/data/models/grid';
import { GridFull, GridFullNumber } from 'src/app/data/models/grid-full';

export function gridToGridFull(grid: Grid): GridFull {
  const gridNumbers: GridFullNumber[] = [];
  grid.quines.forEach((quine, index) => {
    quine.forEach((number) => {
      let gridFullNumber: GridFullNumber = {
        x: index,
        y: number === 90 ? 8 : Math.floor(number / 10),
        numero: number,
      };
      gridNumbers.push(gridFullNumber);
    });
  });

  const matrix: number[][] = initMatrix();

  gridNumbers.forEach((gridNumber) => {
    matrix[gridNumber.x][gridNumber.y] = gridNumber.numero ?? 0;
  });

  let gridFull: GridFull = {
    numero: grid.numero,
    type: grid.type,
    matrix,
  };
  return gridFull;
}

export function initMatrix(): number[][] {
  let matriceVide: number[][] = [];
  for (let i = 0; i < 3; i++) {
    matriceVide[i] = new Array<number>(9).fill(0);
  }
  return matriceVide;
}
