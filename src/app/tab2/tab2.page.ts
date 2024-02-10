import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Select, Store } from '@ngxs/store';
import { Observable, delay, skip } from 'rxjs';
import { tirageTypeParams } from '../data/constants/app.constants';
import { TirageMode } from '../data/enum/tirage-mode.enum';
import { TirageType } from '../data/enum/tirage-type.enum';
import { Grid } from '../data/models/grid';
import { UnselectAllGridsAction } from '../store/grids/grids.actions';
import { GridState } from '../store/grids/grids.state';
import { ClearTirageAction } from '../store/tirage/tirage.actions';
import { TirageState } from '../store/tirage/tirage.state';
import { MyGridsModalComponent } from '../tab1/my-grids/my-grids-modal/my-grids-modal.component';
import { MyGridsComponent } from '../tab1/my-grids/my-grids.component';
import { NinetyKeyboardComponent } from './ninety-keyboard/ninety-keyboard.component';
import { TirageLastNumbersComponent } from './tirage-last-numbers/tirage-last-numbers.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonContent,
    IonFooter,
    NinetyKeyboardComponent,
    IonToolbar,
    IonTitle,
    IonItem,
    IonListHeader,
    CommonModule,
    IonButton,
    IonList,
    IonLabel,
    MyGridsComponent,
    TirageLastNumbersComponent,
    IonIcon,
    IonRadioGroup,
    IonRadio,
    ReactiveFormsModule,
  ],
})
export class Tab2Page implements OnInit {
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly modalcontroller = inject(ModalController);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly alertController = inject(AlertController);
  private readonly alert?: any;
  public showKeyboard = true;

  @Select(GridState.getGrids) grids$!: Observable<Grid[]>;

  @Select(TirageState.getTirageNumbers)
  tirageNumbers$!: Observable<number[]>;

  private gridsSignal = toSignal(this.grids$);
  public selectedGrids = computed(() =>
    this.gridsSignal()?.filter((grid) => grid.isSelected)
  );

  public TirageType = TirageType;
  public SelectionMode = TirageMode;
  public selectionMode = TirageMode.INITIAL;

  public tirageTypeFormcontrol = this.fb.control(TirageType.Quine);

  public ngOnInit(): void {
    this.tirageNumbers$
      .pipe(skip(1), delay(250), takeUntilDestroyed(this.destroyRef$))
      .subscribe(() => {
        switch (this.tirageTypeFormcontrol.value) {
          case TirageType.Quine:
            const winGridsQuine = this.gridsSignal()?.filter(
              (g) => g.isSelected && g.isQuine
            );
            if (winGridsQuine?.length) {
              this.openWinModal(
                TirageType.Quine,
                winGridsQuine,
                winGridsQuine?.length > 1
              );
            }
            break;
          case TirageType.Double_Quine:
            const winGridsDoubleQuine = this.gridsSignal()?.filter(
              (g) => g.isSelected && g.isDoubleQuine
            );
            if (winGridsDoubleQuine?.length) {
              this.openWinModal(
                TirageType.Double_Quine,
                winGridsDoubleQuine,
                winGridsDoubleQuine?.length > 1
              );
            }
            break;
          case TirageType.Carton_Plein:
            const winGridsCartonPlein = this.gridsSignal()?.filter(
              (g) => g.isSelected && g.isCartonPlein
            );
            if (winGridsCartonPlein?.length) {
              this.openWinModal(
                TirageType.Carton_Plein,
                winGridsCartonPlein,
                winGridsCartonPlein?.length > 1
              );
            }
            break;
          default:
            break;
        }
      });
  }
  public startTirage(): void {
    this.store.dispatch(new ClearTirageAction());
    this.selectionMode = TirageMode.IN_PROGRESS;
    this.tirageTypeFormcontrol.patchValue(TirageType.Quine);
    this.showKeyboard = true;
  }

  public reselectGrids(): void {
    this.store.dispatch(new UnselectAllGridsAction());
    this.selectionMode = TirageMode.INITIAL;
  }

  public demarquer(): void {
    this.store.dispatch(new ClearTirageAction());
  }

  private async openWinModal(
    tirageType: TirageType,
    gridsToDisplay: Grid[],
    isMultipleWins: boolean
  ): Promise<void> {
    const modal = await this.modalcontroller.create({
      component: MyGridsModalComponent,
      componentProps: {
        grids: [...gridsToDisplay],
        isSelectable: false,
        isEditable: false,
        displayBadges: true,
        tirageType: this.tirageTypeFormcontrol.value,
        winNumbers: gridsToDisplay.length,
        title: isMultipleWins
          ? tirageTypeParams[tirageType].winNamePluriel
          : tirageTypeParams[tirageType].winNameSingulier,
      },
      animated: true,
      breakpoints: [0, 0.6],
      initialBreakpoint: 0.6,
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((res: any) => {
      console.log('close', res.data);
      if (res?.data?.tirageType) {
        this.tirageTypeFormcontrol.patchValue(res.data.tirageType);
      }
    });
    await modal.present();
  }

  public originalOrder(): number {
    return 0;
  }
  public unselectAll(): void {
    this.store.dispatch(new UnselectAllGridsAction());
    this.cd.detectChanges();
  }
}
