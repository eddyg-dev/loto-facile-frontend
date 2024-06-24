import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Message } from 'src/app/data/enum/message.enum';
import { Category } from 'src/app/data/models/category';
import { Grid } from 'src/app/data/models/grid';
import { transformChaineToGrid } from 'src/app/shared/utils/import.utils';
import { CategoryState } from 'src/app/store/category/category.state';
import { AddGridsAction } from 'src/app/store/grids/grids.actions';
import { MyGridsComponent } from '../my-grids/my-grids.component';

@Component({
  selector: 'app-import-file',
  standalone: true,
  imports: [
    CommonModule,
    IonFooter,
    IonContent,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonListHeader,
    IonList,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonItem,
    IonHeader,
    IonSelect,
    IonSelectOption,
    FormsModule,
    AsyncPipe,
    MyGridsComponent,
  ],
  templateUrl: './import-file.component.html',
  styleUrl: './import-file.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportFileComponent {
  private readonly alertController = inject(AlertController);
  private readonly modalController = inject(ModalController);
  private readonly store = inject(Store);
  newGrids: Grid[] = [];

  public categories$: Observable<Category[]> = this.store.select(
    CategoryState.getCategories
  );
  categoryId?: string;
  csvText?: string;

  public fileImported(event: any): void {
    this.csvText = '';
    const file = event.target.files[0];
    // "text/csv"
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const format = file.type;
      this.csvText = e.target.result as string;
      this.update();
    };
    reader.readAsText(file);
  }

  public close(): void {
    this.modalController.dismiss();
  }

  public update(): void {
    if (this.csvText && this.categoryId) {
      this.newGrids = transformChaineToGrid(
        this.csvText,
        this.categoryId
      ) as Grid[];
      this.store.dispatch(new AddGridsAction(this.newGrids));
    }
  }

  public validate(): void {
    this.store.dispatch(new AddGridsAction(this.newGrids)).subscribe(() => {
      this.modalController.dismiss();
    });
  }

  public async openImportInfo(): Promise<void> {
    const alert = await this.alertController.create({
      animated: true,
      header: 'Infos sur les imports ',
      message: Message.Import_Info,
    });
    await alert.present();
  }
}
