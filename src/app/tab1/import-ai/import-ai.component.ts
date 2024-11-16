import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, ToastController } from '@ionic/angular';
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
  IonSkeletonText,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Category } from 'src/app/data/models/category';
import { Grid } from 'src/app/data/models/grid';
import { GridFromImageResponse } from 'src/app/data/models/grid-from-image-response';
import { InAppPurchaseService } from 'src/app/shared/services/in-app-purchase.service';
import { OpenAiService } from 'src/app/shared/services/open-ai.service';
import { GridFullComponent } from 'src/app/shared/ui/grid-full/grid-full.component';
import { isGridFromPhotoValid } from 'src/app/shared/utils/import.utils';
import { CategoryState } from 'src/app/store/category/category.state';
import { AddGridsAction } from 'src/app/store/grids/grids.actions';
import { MyGridsComponent } from '../my-grids/my-grids.component';

import 'cordova-plugin-purchase';
import { Message } from 'src/app/data/enum/message.enum';
import { PageLoaderComponent } from 'src/app/shared/ui/page-loader/page-loader.component';
import { PremiumOfferComponent } from 'src/app/tab3/premium-offer/premium-offer.component';
import { environment } from 'src/environments/environment';
import { v4 as guid } from 'uuid';
import { SaveCategoryComponent } from '../categories/save-category/save-category.component';

declare var CdvPurchase: any;

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
    IonSkeletonText,
    GridFullComponent,
    PageLoaderComponent,
  ],
  templateUrl: './import-ai.component.html',
  styleUrls: ['./import-ai.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportAIComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  private readonly alertController = inject(AlertController);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly modalcontroller = inject(ModalController);
  private readonly toastController = inject(ToastController);
  private readonly store = inject(Store);
  private readonly purchaseService = inject(InAppPurchaseService);
  private readonly openAiService = inject(OpenAiService);
  tempGrids: Grid[] = [];
  isImporting = signal(false);

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
    if (this.tempGrids.length) {
      this.tempGrids = this.tempGrids.map((grid) => ({
        ...grid,
        categoryId: this.categoryId ?? '',
        id: guid(),
      }));

      this.store.dispatch(new AddGridsAction(this.tempGrids)).subscribe(() => {
        this.close();
      });
    }
  }

  public selectPhotoPremium(): void {
    if (this.purchaseService.isPremiumUser$.value || !environment.production) {
      this.selectPhoto();
    } else {
      this.showPremiumAlert();
    }
  }
  // Gestion de la capture d'image avec la caméra
  public async selectPhoto(): Promise<void> {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: environment.production
        ? CameraSource.Prompt
        : CameraSource.Photos,
      promptLabelCancel: 'Annuler',
      promptLabelHeader: 'LOTO FACILE',
      promptLabelPicture: 'Prendre une nouvelle photo',
      promptLabelPhoto: 'Choisir dans votre galerie',
      saveToGallery: true,
    });

    const base64Image = photo.base64String as string;

    // Envoyer l'image pour analyse
    this.analyzeImage(base64Image);
  }

  public onFileInputClick() {
    if (this.purchaseService.isPremiumUser$.value || !environment.production) {
      this.fileInput.nativeElement.click();
    } else {
      this.showPremiumAlert();
    }
  }

  private analyzeImage(base64Image: string): void {
    this.isImporting.set(true);
    this.cdr.markForCheck();
    this.openAiService.analyzeImage(base64Image).subscribe(
      (gridsResponse: GridFromImageResponse[]) => {
        this.actualizeTempGrids(gridsResponse);
        this.isImporting.set(false);
        this.cdr.markForCheck();
      },
      (err: any) => {
        this.presentToast(Message.Import_Error);
        console.log(err);
        this.isImporting.set(false);
        this.cdr.markForCheck();
      }
    );
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
    });
    await toast.present();
  }

  private async showPremiumAlert(): Promise<void> {
    const alert = await this.alertController.create({
      animated: true,
      header: 'LOTO FACILE PREMIUM',
      message: `Cette fonctionnalité est réservée aux utilisateurs premium. Souhaitez-vous essayer gratuitement pendant 1 mois ?`,
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
        },
        {
          text: 'Oui',
          handler: () => this.openPremiumOffer(),
        },
      ],
    });
    await alert.present();
  }

  private async openPremiumOffer(): Promise<void> {
    const modal = await this.modalcontroller.create({
      animated: true,
      component: PremiumOfferComponent,
    });
    await modal.present();
  }

  public async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      // Vérification de la taille du fichier
      const maxSizeInBytes = this.fileSizeLimit * 1024 * 1024; // 20MB
      if (file.size > maxSizeInBytes) {
        this.presentToast('La taille du fichier dépasse la limite de 20MB.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      if (
        ![
          'application/pdf',
          'text/csv',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ].includes(file.type)
      ) {
        this.presentToast("Le fichier n'est pas supporté");
        return;
      }

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
      this.isImporting.set(true);

      this.openAiService.analyzeFile(formData).subscribe(
        (gridsResponse: GridFromImageResponse[]) => {
          this.actualizeTempGrids(gridsResponse);
          this.isImporting.set(false);
          this.cdr.markForCheck();
        },
        (err: any) => {
          this.presentToast(Message.Import_Error);
          console.log(err);
          this.isImporting.set(false);
          this.cdr.markForCheck();
        }
      );
    }
  }

  async showInfo(type: 'photo' | 'file') {
    const header =
      type === 'photo' ? 'Prendre ou choisir une photo' : 'Importer un fichier';
    const message =
      type === 'photo'
        ? 'Vous pouvez prendre une photo ou sélectionner une photo existante. Assurez-vous que l’image est bien cadrée et claire.'
        : 'Vous pouvez importer un fichier PDF, CSV ou XLSX. Assurez-vous que le fichier est au bon format pour une analyse optimale.';

    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  private actualizeTempGrids(gridsResponse: any) {
    let gridsResponseRandom = gridsResponse?.length
      ? gridsResponse
      : gridsResponse[Object.keys(gridsResponse)[0]]?.length
      ? gridsResponse[Object.keys(gridsResponse)[0]]
      : [];

    if (!gridsResponseRandom?.length) {
      gridsResponseRandom = [gridsResponse];
    }

    if (gridsResponseRandom?.length) {
      const newTempGrids = gridsResponseRandom
        .filter((g: GridFromImageResponse) => isGridFromPhotoValid(g))
        .map((grid: GridFromImageResponse) => this.mapResponseToGrid(grid));

      if (newTempGrids?.length) {
        this.tempGrids = [...this.tempGrids, ...newTempGrids];
        this.cdr.detectChanges();
        console.log('this.tempGrids ', this.tempGrids);
      } else {
        this.presentToast(Message.Import_Error);
      }
    }
  }

  deleteTempGrid(index: number): void {
    this.tempGrids = this.tempGrids.filter((g, i) => i !== index);
    this.cdr.detectChanges();
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

  public async openSaveCategoryModal(category?: Category): Promise<void> {
    const saveCategoryComponentModal = await this.modalcontroller.create({
      component: SaveCategoryComponent,
      animated: true,
      componentProps: { category },
      backdropDismiss: true,
      initialBreakpoint: 0.7,
    });
    await saveCategoryComponentModal.present();
  }
}
