import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
} from '@ionic/angular/standalone';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GridType } from 'src/app/data/enum/grid-type.enum';
import { SelectionMode } from 'src/app/data/enum/selection-mode.enum';
import { Grid } from 'src/app/data/models/grid';
import { GridFullComponent } from 'src/app/shared/ui/grid-full/grid-full.component';
import { GridState, GridStateModel } from 'src/app/store/grids/grids.state';

@Component({
  selector: 'app-tirage',
  standalone: true,
  imports: [
    IonItem,
    IonListHeader,
    CommonModule,
    IonButton,
    IonList,
    IonLabel,
    GridFullComponent,
  ],
  templateUrl: './tirage.component.html',
  styleUrl: './tirage.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TirageComponent implements OnInit {
  @Select(GridState.getGrids) grids$: Observable<Grid[]> | undefined;

  @Select((state: { gridState: GridStateModel }) =>
    GridState.getGridsByType(state.gridState, GridType.LOTO)
  )
  gridsLotos$?: Observable<Grid[]>;

  ngOnInit(): void {
    this.grids$?.subscribe((res) => {
      console.log('res 1', res);
    });
    this.gridsLotos$?.subscribe((res) => {
      console.log('res 2', res);
    });
  }

  public SelectionMode = SelectionMode;
  public selectionMode = SelectionMode.INITIAL;

  public createNewTirage(): void {
    this.selectionMode = SelectionMode.IN_PROGRESS;
  }

  public validateSelection(): void {
    this.selectionMode = SelectionMode.VALIDATED;
  }
}
