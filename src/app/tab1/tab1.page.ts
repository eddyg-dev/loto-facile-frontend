import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Grid } from '../data/models/grid';
import { transformChaineToGrid } from '../shared/utils/import.utils';
import {
  AddGridsAction,
  DeleteAllGridsAction,
} from '../store/grids/grids.actions';
import { GridState } from '../store/grids/grids.state';
import { NinetyKeyboardComponent } from '../tab2/ninety-keyboard/ninety-keyboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { MyGridsComponent } from './my-grids/my-grids.component';
import { SaveGridComponent } from './save-grid/save-grid.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    MyGridsComponent,
    IonList,
    IonItem,
    IonFooter,
    NinetyKeyboardComponent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    FormsModule,
    CategoriesComponent,
  ],
})
export class Tab1Page implements OnInit {
  private readonly store = inject(Store);
  private readonly modalController = inject(ModalController);
  public segment = 'carton';
  public grids$: Observable<Grid[]> = this.store.select(GridState.getGrids);
  public grids: Grid[] = [];

  ngOnInit(): void {
    this.grids$.subscribe((grids) => {
      console.log('grids ', grids);

      this.grids = grids;
    });
  }
  public clearAll(): void {
    this.store.dispatch(new DeleteAllGridsAction());
  }

  public async addGrid(): Promise<void> {
    const modal = await this.modalController.create({
      component: SaveGridComponent,
    });
    modal.present();
  }
  public fileImported(event: any): void {
    const file = event.target.files[0];
    console.log('file ', file);

    // "text/csv"

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const format = file.type;
      const csvText = e.target.result as string;
      let grids = transformChaineToGrid(csvText) as Grid[];
      this.store.dispatch(new AddGridsAction(grids));
    };
    reader.readAsText(file);
  }
}
