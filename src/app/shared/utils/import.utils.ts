import { regex1 } from 'src/app/data/constants/regex.constants';
import { Grid } from 'src/app/data/models/grid';
import { v4 as uuidv4 } from 'uuid';

export function transformChaineToGrid(chaine: string): Grid[] | undefined {
  const lignes = chaine.split('\n');
  const result: Grid[] = [];
  for (const ligne of lignes) {
    const match = ligne.match(regex1);
    if (match) {
      const numeroGrille = parseInt(match[1], 10);
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
        isSelected: false,
        isQuine: false,
        isDoubleQuine: false,
        isCartonPlein: false,
        categoryId: '0',
      };

      result.push(grid);
    } else {
      const regexBingo =
        'N°(\\d+) - BINGO LOTO - Planche N°(\\d+),(\\d+),(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-';

      const matchBingo = ligne.match(regexBingo);

      if (matchBingo) {
        const numeroGrille = parseInt(matchBingo[1], 10);
        const quines = [
          [
            { number: parseInt(matchBingo[4], 10), isDrawed: false },
            { number: parseInt(matchBingo[5], 10), isDrawed: false },
            { number: parseInt(matchBingo[6], 10), isDrawed: false },
            { number: parseInt(matchBingo[7], 10), isDrawed: false },
            { number: parseInt(matchBingo[8], 10), isDrawed: false },
          ],
          [
            { number: parseInt(matchBingo[9], 10), isDrawed: false },
            { number: parseInt(matchBingo[10], 10), isDrawed: false },
            { number: parseInt(matchBingo[11], 10), isDrawed: false },
            { number: parseInt(matchBingo[12], 10), isDrawed: false },
            { number: parseInt(matchBingo[13], 10), isDrawed: false },
          ],
          [
            { number: parseInt(matchBingo[14], 10), isDrawed: false },
            { number: parseInt(matchBingo[15], 10), isDrawed: false },
            { number: parseInt(matchBingo[16], 10), isDrawed: false },
            { number: parseInt(matchBingo[17], 10), isDrawed: false },
            { number: parseInt(matchBingo[18], 10), isDrawed: false },
          ],
        ];

        const planche: Grid = {
          id: uuidv4(),
          numero: numeroGrille,
          quines: quines,
          isSelected: false,
          isQuine: false,
          isDoubleQuine: false,
          isCartonPlein: false,
          categoryId: '0',
        };

        result.push(planche);
      }
    }
  }

  return result;
}
