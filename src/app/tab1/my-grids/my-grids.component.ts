import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  ModalController,
  IonInput,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GridType } from 'src/app/data/enum/grid-type.enum';
import { Grid } from 'src/app/data/models/grid';
import { GridFullComponent } from 'src/app/shared/ui/grid-full/grid-full.component';
import { SaveGridsAction } from 'src/app/store/grids/grids.actions';
import { GridState } from 'src/app/store/grids/grids.state';
import { SaveGridComponent } from '../save-grid/save-grid.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-my-grids',
  standalone: true,
  imports: [
    IonItem,
    IonInput,
    CommonModule,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonList,
    GridFullComponent,
  ],
  templateUrl: './my-grids.component.html',
  styleUrl: './my-grids.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyGridsComponent {
  private readonly store = inject(Store);
  private readonly modalController = inject(ModalController);
  private readonly router = inject(Router);
  grids$: Observable<Grid[]> = this.store.select(GridState.getGrids);

  public fileImported(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const csvText = e.target.result as string;
      console.log('csvText ', csvText);
      let grids = this.transformerChaineEnObjet(csvText) as Grid[];
      this.store.dispatch(new SaveGridsAction(grids));
    };
    reader.readAsText(file);
  }

  private transformerChaineEnObjet(chaine: string): Grid[] | undefined {
    const lignes = chaine.split('\n');
    const result: Grid[] = [];

    for (const ligne of lignes) {
      const regex =
        'N°(\\d+) - BASIQUE - Planche N°(\\d+),(\\d+),(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-(\\d+)-';

      const match = ligne.match(regex);

      if (match) {
        const numeroGrille = parseInt(match[1], 10);
        const quines = [
          [
            parseInt(match[4], 10),
            parseInt(match[5], 10),
            parseInt(match[6], 10),
            parseInt(match[7], 10),
            parseInt(match[8], 10),
          ],
          [
            parseInt(match[9], 10),
            parseInt(match[10], 10),
            parseInt(match[11], 10),
            parseInt(match[12], 10),
            parseInt(match[13], 10),
          ],
          [
            parseInt(match[14], 10),
            parseInt(match[15], 10),
            parseInt(match[16], 10),
            parseInt(match[17], 10),
            parseInt(match[18], 10),
          ],
        ];

        const grid: Grid = {
          id: uuidv4(),
          numero: numeroGrille,
          quines: quines,
          type: GridType.LOTO,
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
              parseInt(matchBingo[4], 10),
              parseInt(matchBingo[5], 10),
              parseInt(matchBingo[6], 10),
              parseInt(matchBingo[7], 10),
              parseInt(matchBingo[8], 10),
            ],
            [
              parseInt(matchBingo[9], 10),
              parseInt(matchBingo[10], 10),
              parseInt(matchBingo[11], 10),
              parseInt(matchBingo[12], 10),
              parseInt(matchBingo[13], 10),
            ],
            [
              parseInt(matchBingo[14], 10),
              parseInt(matchBingo[15], 10),
              parseInt(matchBingo[16], 10),
              parseInt(matchBingo[17], 10),
              parseInt(matchBingo[18], 10),
            ],
          ];

          const planche: Grid = {
            id: uuidv4(),
            numero: numeroGrille,
            quines: quines,
            type: GridType.BINGO,
          };

          result.push(planche);
        }
      }
    }

    return result;
  }

  public clearAll(): void {
    this.store.dispatch(new SaveGridsAction([]));
  }

  public async addGrid(): Promise<void> {
    const modal = await this.modalController.create({
      component: SaveGridComponent,
    });
    modal.present();
  }
}
