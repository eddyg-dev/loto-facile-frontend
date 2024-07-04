import { regex1 } from 'src/app/data/constants/regex.constants';
import { Grid } from 'src/app/data/models/grid';
import { GridFromImageResponse } from 'src/app/data/models/grid-from-image-response';
import { v4 as uuidv4 } from 'uuid';
import { getSpecifiDizaine } from './transfo.utils';

export function transformChaineToGrid(
  chaine: string,
  categoryId: string
): Grid[] | undefined {
  const lignes = chaine.split('\n');
  const result: Grid[] = [];
  for (const ligne of lignes) {
    const match = ligne.match(regex1);
    if (match) {
      const numeroGrille = match[1];
      const quines = [
        [
          { number: parseInt(match[4], 10), isDrawed: false },
          { number: parseInt(match[5], 10), isDrawed: false },
          { number: parseInt(match[6], 10), isDrawed: false },
          { number: parseInt(match[7], 10), isDrawed: false },
          { number: parseInt(match[8], 10), isDrawed: false },
        ],
        [
          { number: parseInt(match[9], 10), isDrawed: false },
          { number: parseInt(match[10], 10), isDrawed: false },
          { number: parseInt(match[11], 10), isDrawed: false },
          { number: parseInt(match[12], 10), isDrawed: false },
          { number: parseInt(match[13], 10), isDrawed: false },
        ],
        [
          { number: parseInt(match[14], 10), isDrawed: false },
          { number: parseInt(match[15], 10), isDrawed: false },
          { number: parseInt(match[16], 10), isDrawed: false },
          { number: parseInt(match[17], 10), isDrawed: false },
          { number: parseInt(match[18], 10), isDrawed: false },
        ],
      ];

      const grid: Grid = {
        id: uuidv4(),
        numero: numeroGrille,
        quines: quines,
        isSelectedForPlay: false,
        isSelectedForEdit: false,
        isQuine: false,
        isDoubleQuine: false,
        isCartonPlein: false,
        categoryId,
      };

      result.push(grid);
    } else {
      const regexBingo =
        'N°(\\d+) - BINGO LOTO - Planche N°(\\d+),(\\d+),(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-';

      const matchBingo = ligne.match(regexBingo);

      if (matchBingo) {
        const numeroGrille = matchBingo[1];
        const field1Value = parseInt(matchBingo[4], 10);
        const field2Value = parseInt(matchBingo[5], 10);
        const field3Value = parseInt(matchBingo[6], 10);
        const field4Value = parseInt(matchBingo[7], 10);
        const field5Value = parseInt(matchBingo[8], 10);
        const field6Value = parseInt(matchBingo[9], 10);
        const field7Value = parseInt(matchBingo[10], 10);
        const field8Value = parseInt(matchBingo[11], 10);
        const field9Value = parseInt(matchBingo[12], 10);
        const field10Value = parseInt(matchBingo[13], 10);
        const field11Value = parseInt(matchBingo[14], 10);
        const field12Value = parseInt(matchBingo[15], 10);
        const field13Value = parseInt(matchBingo[16], 10);
        const field14Value = parseInt(matchBingo[17], 10);
        const field15Value = parseInt(matchBingo[18], 10);
        const quines = [
          [
            { number: field1Value, isDrawed: false },
            { number: field2Value, isDrawed: false },
            { number: field3Value, isDrawed: false },
            { number: field4Value, isDrawed: false },
            { number: field5Value, isDrawed: false },
          ],
          [
            { number: field6Value, isDrawed: false },
            { number: field7Value, isDrawed: false },
            { number: field8Value, isDrawed: false },
            { number: field9Value, isDrawed: false },
            { number: field10Value, isDrawed: false },
          ],
          [
            { number: field11Value, isDrawed: false },
            { number: field12Value, isDrawed: false },
            { number: field13Value, isDrawed: false },
            { number: field14Value, isDrawed: false },
            { number: field15Value, isDrawed: false },
          ],
        ];

        const planche: Grid = {
          id: uuidv4(),
          numero: numeroGrille,
          quines: quines,
          isSelectedForPlay: false,
          isSelectedForEdit: false,
          isQuine: false,
          isDoubleQuine: false,
          isCartonPlein: false,
          categoryId,
        };

        result.push(planche);
      }
    }
  }
  return result;
}

export function isValidOneToNinety(numbers: (number | undefined)[]): boolean {
  return numbers.every((n) => n && n > 0 && n <= 90);
}

export function isNumbersDifferent(numbers: (number | undefined)[]): boolean {
  return numbers.length === 15 && [...new Set(numbers)].length === 15;
}

export function isSorted(
  n1: number,
  n2: number,
  n3: number,
  n4: number,
  n5: number
): boolean {
  return n1 < n2 && n2 < n3 && n3 < n4 && n4 < n5;
}

export function isDifferentDizaine(
  n1: number,
  n2: number,
  n3: number,
  n4: number,
  n5: number
): boolean {
  return (
    [...new Set([n1, n2, n3, n4, n5].map((n) => getSpecifiDizaine(n)))]
      .length === 5
  );
}

export function photosToValidGrids(
  gridFromPhoto: GridFromImageResponse[]
): Grid[] {
  return gridFromPhoto
    .filter((gridPhoto) => isGridFromPhotoValid(gridPhoto))
    .map((gridResponse) => {
      return {
        id: uuidv4(),
        numero: '1',
        quines: [],
        isSelectedForPlay: false,
        isSelectedForEdit: false,
        isQuine: false,
        isDoubleQuine: false,
        isCartonPlein: false,
        categoryId: '1',
      };
    });
}

export function isGridFromPhotoValid(
  gridFromPhoto: GridFromImageResponse
): boolean {
  const allNumbers = getAllNumbers(gridFromPhoto.quines);
  const rulesOK =
    isValidOneToNinety(allNumbers) &&
    isNumbersDifferent(allNumbers) &&
    isSorted(
      gridFromPhoto.quines[0][0],
      gridFromPhoto.quines[0][1],
      gridFromPhoto.quines[0][2],
      gridFromPhoto.quines[0][3],
      gridFromPhoto.quines[0][4]
    ) &&
    isSorted(
      gridFromPhoto.quines[1][0],
      gridFromPhoto.quines[1][1],
      gridFromPhoto.quines[1][2],
      gridFromPhoto.quines[1][3],
      gridFromPhoto.quines[1][4]
    ) &&
    isSorted(
      gridFromPhoto.quines[2][0],
      gridFromPhoto.quines[2][1],
      gridFromPhoto.quines[2][2],
      gridFromPhoto.quines[2][3],
      gridFromPhoto.quines[2][4]
    ) &&
    isDifferentDizaine(
      gridFromPhoto.quines[0][0],
      gridFromPhoto.quines[0][1],
      gridFromPhoto.quines[0][2],
      gridFromPhoto.quines[0][3],
      gridFromPhoto.quines[0][4]
    ) &&
    isDifferentDizaine(
      gridFromPhoto.quines[1][0],
      gridFromPhoto.quines[1][1],
      gridFromPhoto.quines[1][2],
      gridFromPhoto.quines[1][3],
      gridFromPhoto.quines[1][4]
    ) &&
    isDifferentDizaine(
      gridFromPhoto.quines[2][0],
      gridFromPhoto.quines[2][1],
      gridFromPhoto.quines[2][2],
      gridFromPhoto.quines[2][3],
      gridFromPhoto.quines[2][4]
    );
  return rulesOK;
}

export function getAllNumbers(quines: number[][]): number[] {
  return quines.reduce((acc, current) => acc.concat(current), []);
}
