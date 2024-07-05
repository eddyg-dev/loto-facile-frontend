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

  fileSizeLimit = 20;

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

  public async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Check file type
      const allowedTypes = ['application/pdf', 'text/csv'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF and CSV files are accepted.');
        return;
      }

      // Check file size
      const maxSizeInBytes = this.fileSizeLimit * 1024 * 1024; // 10MB
      if (file.size > maxSizeInBytes) {
        alert('File size exceeds the limit of 20MB.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      let fileType = 'csv';
      if (file.type === 'application/pdf') {
        fileType = 'pdf';
      }

      formData.append('fileType', fileType);

      this.openAiService.analyzeFile(formData).subscribe(
        (r: GridFromImageResponse[]) => {
          if (r.length) {
            console.log(r);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }

  // Select photo from camera or gallery
  public async selectPhoto(source?: CameraSource): Promise<void> {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: source ?? CameraSource.Photos,
    });

    const base64Image = photo.base64String as string;

    // Check image type
    const mimeType = photo.format === 'jpeg' ? 'image/jpeg' : 'image/png'; // Assuming jpeg or png format

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(mimeType)) {
      alert('Only JPEG and PNG images are accepted.');
      return;
    }

    // Check image size
    const maxSizeInBytes = this.fileSizeLimit * 1024 * 1024; // 10MB
    const fileSizeInBytes = base64Image.length * 0.75; // Base64 image size estimation
    if (fileSizeInBytes > maxSizeInBytes) {
      alert('Image size exceeds the limit of 20MB.');
      return;
    }

    this.openAiService.analyzeImage(base64Image).subscribe(
      (r: GridFromImageResponse[]) => {
        if (r.length) {
          console.log(r);
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
