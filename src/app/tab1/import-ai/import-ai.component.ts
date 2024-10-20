import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Category } from 'src/app/data/models/category';
import { Grid } from 'src/app/data/models/grid';
import { GridFromImageResponse } from 'src/app/data/models/grid-from-image-response';
import { OpenAiService } from 'src/app/shared/services/open-ai.service';
import { GridFullComponent } from 'src/app/shared/ui/grid-full/grid-full.component';
import { CategoryState } from 'src/app/store/category/category.state';
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
    IonCol,
    IonGrid,
    IonRow,
    GridFullComponent,
  ],
  templateUrl: './import-ai.component.html',
  styleUrls: ['./import-ai.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportAIComponent {
  private readonly alertController = inject(AlertController);
  private readonly modalcontroller = inject(ModalController);
  private readonly store = inject(Store);
  private readonly openAiService = inject(OpenAiService);
  tempGrids: Grid[] = [];

  fileSizeLimit = 20; // Limite de taille de fichier en MB

  public categories$: Observable<Category[]> = this.store.select(
    CategoryState.getCategories
  );
  categoryId?: string;

  public update(): void {}

  public close(): void {
    this.modalcontroller.dismiss();
  }

  public validate(): void {
    // if (this.tempGrids.length) {
    //   this.store.dispatch(new AddGridsAction(this.tempGrids)).subscribe(() => {
    //     // Fermer la modale ou gérer la validation
    //   });
    // }
  }

  // Gestion de la capture d'image avec la caméra
  public async selectPhoto(): Promise<void> {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    const base64Image = photo.base64String as string;

    // Envoyer l'image pour analyse
    this.analyzeImage(base64Image);
  }

  // Méthode pour analyser une image encodée en base64
  private analyzeImage(base64Image: string): void {
    this.openAiService.analyzeImage(base64Image).subscribe(
      (gridsResponse: GridFromImageResponse[]) => {
        console.log(gridsResponse);

        // if (r.length) {
        //   this.tempGrids = r.map((grid) => this.mapResponseToGrid(grid));
        //   console.log('Grids:', this.tempGrids);
        // }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  // Méthode pour analyser un fichier (CSV, Excel ou PDF)
  public async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Vérification de la taille du fichier
      const maxSizeInBytes = this.fileSizeLimit * 1024 * 1024; // 20MB
      if (file.size > maxSizeInBytes) {
        alert('La taille du fichier dépasse la limite de 20MB.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      // Détecter le type de fichier
      let fileType = '';
      if (file.type === 'application/pdf') {
        fileType = 'pdf';
      } else if (file.type.includes('spreadsheetml.sheet')) {
        fileType = 'excel';
      } else if (file.type === 'text/csv') {
        fileType = 'csv';
      } else if (file.type.includes('image')) {
        fileType = 'image';
      }

      formData.append('fileType', fileType);

      // Envoyer le fichier pour analyse
      this.openAiService.analyzeFile(formData).subscribe(
        (response: GridFromImageResponse[]) => {
          if (response.length) {
            this.tempGrids = response.map((grid) =>
              this.mapResponseToGrid(grid)
            );
            console.log('Grids:', this.tempGrids);
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
