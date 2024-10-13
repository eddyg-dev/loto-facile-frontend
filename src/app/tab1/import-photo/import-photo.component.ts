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
} from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
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
  styleUrls: ['./import-photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportPhotoComponent {
  private readonly alertController = inject(AlertController);
  private readonly store = inject(Store);
  private readonly openAiService = inject(OpenAiService);
  newGrids: Grid[] = [];

  fileSizeLimit = 20; // Limite de taille de fichier en MB

  public categories$: Observable<Category[]> = this.store.select(
    CategoryState.getCategories
  );
  categoryId?: string;

  public update(): void {}

  public close(): void {
    // Ferme la modale
  }

  public validate(): void {
    if (this.newGrids.length) {
      this.store.dispatch(new AddGridsAction(this.newGrids)).subscribe(() => {
        // Fermer la modale ou gérer la validation
      });
    }
  }

  public async openImportInfo(): Promise<void> {
    const alert = await this.alertController.create({
      animated: true,
      header: 'Infos sur les imports',
      message: 'Veuillez importer un fichier CSV, Excel ou une image.',
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

    // Vérification du type d'image
    const mimeType = photo.format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(mimeType)) {
      alert('Only JPEG and PNG images are accepted.');
      return;
    }

    // Vérification de la taille de l'image
    const maxSizeInBytes = this.fileSizeLimit * 1024 * 1024; // 20MB
    const fileSizeInBytes = base64Image.length * 0.75; // Estimation de la taille de l'image en Base64
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

  // Méthode pour importer et analyser un fichier CSV, Excel ou PDF
  public async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Vérification du type de fichier
      const allowedTypes = [
        'application/pdf',
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (xlsx)
        'image/jpeg',
        'image/png',
      ];
      if (!allowedTypes.includes(file.type)) {
        alert('Seuls les fichiers PDF, CSV, Excel et images sont acceptés.');
        return;
      }

      // Vérification de la taille du fichier
      const maxSizeInBytes = this.fileSizeLimit * 1024 * 1024; // 20MB
      if (file.size > maxSizeInBytes) {
        alert('La taille du fichier dépasse la limite de 20MB.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      let fileType = 'csv'; // Définir un type par défaut
      if (file.type === 'application/pdf') {
        fileType = 'pdf';
      } else if (file.type.includes('spreadsheetml.sheet')) {
        fileType = 'excel';
      } else if (file.type.includes('image')) {
        fileType = 'image';
      }

      formData.append('fileType', fileType);

      // Envoyer le fichier au service pour analyse
      this.openAiService.analyzeFile(formData).subscribe(
        (response: GridFromImageResponse[]) => {
          if (response.length) {
            this.newGrids = response.map((grid) =>
              this.mapResponseToGrid(grid)
            );
            console.log('Grids:', this.newGrids);
          }
        },
        (err: any) => {
          console.error(err);
        }
      );
    }
  }

  private mapResponseToGrid(grid: GridFromImageResponse): Grid {
    return {
      numero: grid.numero?.toString() || '',
      quines: grid.quines.map((quine) =>
        quine.map((numero) => ({ number: numero, isDrawed: false }))
      ),
      isSelectedForPlay: false,
      isSelectedForEdit: false,
      isQuine: false,
      isDoubleQuine: false,
      isCartonPlein: false,
      categoryId: this.categoryId ?? '',
    };
  }
}
