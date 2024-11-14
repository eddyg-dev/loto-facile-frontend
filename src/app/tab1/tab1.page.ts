import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Signal,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  ActionSheetController,
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Message } from '../data/enum/message.enum';
import { Category } from '../data/models/category';
import { Grid } from '../data/models/grid';
import { CategoryState } from '../store/category/category.state';
import {
  DeleteGridAction,
  DeleteGridsAction,
  EditGridsAction,
  UnselectAllGridsAction,
} from '../store/grids/grids.actions';
import { GridState } from '../store/grids/grids.state';
import { NinetyKeyboardComponent } from '../tab2/ninety-keyboard/ninety-keyboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { SaveCategoryComponent } from './categories/save-category/save-category.component';
import { ImportAIComponent } from './import-ai/import-ai.component';
import { MyGridsComponent } from './my-grids/my-grids.component';
import { SaveGridComponent } from './save-grid/save-grid.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonFab,
    IonFabList,
    IonFabButton,
    IonIcon,
    IonButtons,
    IonSearchbar,
    IonListHeader,
    AsyncPipe,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFabButton,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tab1Page {
  private readonly store = inject(Store);
  private readonly modalController = inject(ModalController);
  private readonly actionSheetController = inject(ActionSheetController);
  private readonly alertController = inject(AlertController);
  private readonly cd$ = inject(ChangeDetectorRef);
  public segment: 'carton' | 'category' = 'carton';
  public categories$: Observable<Category[]> = this.store.select(
    CategoryState.getCategories
  );
  private categoriesSignal: Signal<Category[] | undefined> = toSignal(
    this.categories$
  );
  public grids$: Observable<Grid[]> = this.store.select(GridState.getGrids);
  private gridsSignal: Signal<Grid[] | undefined> = toSignal(this.grids$);
  public selectedGrids = computed(() =>
    this.gridsSignal()?.filter((grid) => grid.isSelectedForEdit)
  );

  public isLoading = false;
  public isSelectableForEdit = false;

  public async editGrids(action: 'delete' | 'move'): Promise<void> {
    const buttons: { text: string; role?: string; handler?: () => void }[] = [
      {
        text: 'Annuler',
        role: 'cancel',
      },
    ];
    let gridsToEdit = this.gridsSignal()?.filter((g) => g.isSelectedForEdit);
    if (action === 'delete') {
      buttons.push({
        text: 'Oui',
        handler: () => {
          if (gridsToEdit?.length) {
            this.store.dispatch(
              new DeleteGridsAction(
                gridsToEdit.map((grid) => grid.id) as string[]
              )
            );
          }
          return { actionEnded: true };
        },
      });
    } else if (action === 'move') {
      this.categoriesSignal()?.forEach((c) => {
        const button = {
          text: c.name,
          handler: () => {
            gridsToEdit?.map((g) => (g.categoryId = c.id));
            this.store.dispatch(new EditGridsAction(gridsToEdit as Grid[]));
            return { actionEnded: true };
          },
        };
        buttons.push(button);
      });
    }

    const alert = await this.alertController.create({
      animated: true,
      header: action === 'delete' ? 'Supprimer' : 'Déplacer',
      message:
        action === 'delete'
          ? Message.Delete_Multiple_Grids
          : Message.Move_Multiple_Grids,
      buttons,
    });
    alert.onDidDismiss().then((res) => {
      if (res?.data?.actionEnded) {
        this.isSelectableForEdit = false;
        this.cd$.detectChanges();
      }
    });
    await alert.present();
  }

  segmentChange(): void {
    this.isSelectableForEdit = false;
  }

  public ionViewDidEnter(): void {
    this.store.dispatch(new UnselectAllGridsAction());
    this.isSelectableForEdit = false;
  }

  public editMulitpleMode(): void {
    this.store.dispatch(new UnselectAllGridsAction());
    this.isSelectableForEdit = !this.isSelectableForEdit;
  }

  public async addGrid(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Ajouter un nouveau carton',
      keyboardClose: true,
      buttons: [
        // {
        //   text: 'Fichier PDF ou Excel',
        //   icon: 'document-text-outline',
        //   handler: () => {
        //     this.addFileGrid();
        //   },
        // },
        {
          text: 'Photo ou Fichier (IA) [Premium]',
          icon: 'diamond-outline',
          handler: () => {
            this.openImportPhoto();
          },
          cssClass: 'premium-option', // Ajouter une classe pour un style distinct
        },
        {
          text: 'Manuellement',
          icon: 'pencil-outline',
          handler: () => {
            this.addManualGrid();
          },
        },
        {
          text: 'Annuler',
          role: 'destructive',
          icon: 'close-outline',
        },
      ],
    });

    await actionSheet.present();
  }

  private async addManualGrid(): Promise<void> {
    const modal = await this.modalController.create({
      component: SaveGridComponent,
    });
    modal.present();
  }

  private async openImportPhoto(): Promise<void> {
    const modal = await this.modalController.create({
      component: ImportAIComponent,
    });
    modal.present();
    modal.onDidDismiss().then(() => {
      this.cd$.detectChanges();
    });
  }

  public async editGrid(grid: Grid): Promise<void> {
    this.isLoading = true;
    const modal = await this.modalController.create({
      component: SaveGridComponent,
      componentProps: {
        grid,
      },
    });
    modal.onDidDismiss().then((g) => {
      this.isLoading = false;
      this.cd$.detectChanges();
    });
    modal.present();
  }

  public async deleteGrid(grid: Grid): Promise<void> {
    const alert = await this.alertController.create({
      animated: true,
      header: 'Suppression',
      message: `${Message.Delete_Grid} ${grid.numero}`,
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
        },
        {
          text: 'Oui',
          handler: () => {
            this.store.dispatch(new DeleteGridAction(grid.id!));
            this.cd$.detectChanges();
          },
        },
      ],
    });
    await alert.present();
  }

  public async openSaveCategoryModal(category?: Category): Promise<void> {
    const saveCategoryComponentModal = await this.modalController.create({
      component: SaveCategoryComponent,
      animated: true,
      componentProps: { category },
      backdropDismiss: true,
      initialBreakpoint: 0.7,
    });
    await saveCategoryComponentModal.present();
  }
}
