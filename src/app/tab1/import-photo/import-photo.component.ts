import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
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
import { GridFromImageResponse } from 'src/app/data/models/grid-from-image-response';
import { OpenAiService } from 'src/app/shared/services/open-ai.service';
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
  templateUrl: './import-photo.component.html',
  styleUrl: './import-photo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportPhotoComponent {
  private readonly alertController = inject(AlertController);
  private readonly modalController = inject(ModalController);
  private readonly store = inject(Store);
  private readonly openAiService = inject(OpenAiService);
  newGrids: Grid[] = [];

  public categories$: Observable<Category[]> = this.store.select(
    CategoryState.getCategories
  );
  categoryId?: string;

  public update(): void {}

  public close(): void {
    this.modalController.dismiss();
  }

  public validate(): void {
    if (this.newGrids.length) {
      this.store.dispatch(new AddGridsAction(this.newGrids)).subscribe(() => {
        this.modalController.dismiss();
      });
    }
  }

  public async openImportInfo(): Promise<void> {
    const alert = await this.alertController.create({
      animated: true,
      header: 'Infos sur les imports ',
      message: Message.Import_Info,
    });
    await alert.present();
  }

  public async selectPhoto(source?: CameraSource): Promise<void> {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: source ?? CameraSource.Photos,
    });

    const base64Image = photo.base64String as string;
    const formData = new FormData();
    formData.append('image', base64Image as string);
    this.openAiService
      .analyzeImage(base64Image)
      .subscribe((r: GridFromImageResponse[]) => {
        if (r.length) {
          console.log(r);
        }
      }),
      (err: any) => {
        console.log(err);
      };
  }
}
