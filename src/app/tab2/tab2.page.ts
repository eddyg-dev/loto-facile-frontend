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
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
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
import { Message } from '../data/enum/message.enum';
import { TirageMode } from '../data/enum/tirage-mode.enum';
import { TirageType } from '../data/enum/tirage-type.enum';
import { Grid } from '../data/models/grid';
import { PageLoaderComponent } from '../shared/ui/page-loader/page-loader.component';
import { UnselectAllGridsAction } from '../store/grids/grids.actions';
import { GridState } from '../store/grids/grids.state';
import {
  ClearTirageAction,
  SetTirageModeAction,
  SetWinFirstQuineAction,
  SetWinSecondQuineAction,
  SetWinThirdQuineAction,
} from '../store/tirage/tirage.actions';
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
    IonFabButton,
    IonFab,
    IonButtons,
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
    PageLoaderComponent,
  ],
})
export class Tab2Page implements OnInit {
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly modalcontroller = inject(ModalController);
  private readonly alertController = inject(AlertController);
  private readonly cd = inject(ChangeDetectorRef);

  public showKeyboard = true;

  public grids$: Observable<Grid[]> = this.store.select(GridState.getGrids);

  @Select(TirageState.getTirageMode)
  tirageMode$!: Observable<TirageMode>;
  @Select(TirageState.getTirageNumbers)
  tirageNumbers$!: Observable<number[]>;
  @Select(TirageState.getWinFirstQuine)
  winFirstQuine$!: Observable<string[]>;
  @Select(TirageState.getWinSecondQuine)
  winSecondQuine$!: Observable<string[]>;
  @Select(TirageState.getWinThirdQuine)
  winThirdQuine$!: Observable<string[]>;

  private gridsSignal = toSignal(this.grids$);
  private winFirstQuineSignal = toSignal(this.winFirstQuine$);
  private winSecondQuineSignal = toSignal(this.winSecondQuine$);
  private winThirdQuineSignal = toSignal(this.winThirdQuine$);
  public selectedGrids = computed(() =>
    this.gridsSignal()?.filter((grid) => grid.isSelectedForPlay)
  );

  public TirageType = TirageType;
  public TirageMode = TirageMode;

  isLoading = false;
  isDisplayGrids = false;

  public tirageTypeFormcontrol = this.fb.control(TirageType.Quine);

  ionViewDidEnter() {
    this.isLoading = true;
    this.reinitPage();
    setTimeout(() => {
      this.isLoading = false;
    }, 350);
    console.log('vie w enter');
  }
  public ngOnInit(): void {
    this.tirageNumbers$
      .pipe(skip(1), delay(250), takeUntilDestroyed(this.destroyRef$))
      .subscribe((tirage) => {
        const lastNumber = tirage[tirage.length - 1];
        switch (this.tirageTypeFormcontrol.value) {
          case TirageType.Quine:
            const winGridsQuine = this.gridsSignal()?.filter(
              (g) =>
                g.isSelectedForPlay &&
                ((g.isQuine && !this.isAlreadyWinFirstQuine(g)) ||
                  (g.isDoubleQuine && !this.isAlreadyWinSecondQuine(g)) ||
                  (g.isCartonPlein && !this.isAlreadyWinThirdQuine(g)))
            );

            if (winGridsQuine?.length) {
              this.openWinModal(lastNumber, TirageType.Quine, winGridsQuine);

              winGridsQuine.forEach((winGrid) => {
                if (winGrid.isCartonPlein) {
                  this.store.dispatch(
                    new SetWinThirdQuineAction(
                      winGridsQuine.map((w) => winGrid.id as string)
                    )
                  );
                } else if (winGrid.isDoubleQuine) {
                  this.store.dispatch(
                    new SetWinSecondQuineAction(
                      winGridsQuine.map((w) => winGrid.id as string)
                    )
                  );
                } else if (winGrid.isQuine) {
                  this.store.dispatch(
                    new SetWinFirstQuineAction(
                      winGridsQuine.map((w) => winGrid.id as string)
                    )
                  );
                }
              });
            }
            break;
          case TirageType.Double_Quine:
            const winGridsDoubleQuine = this.gridsSignal()?.filter(
              (g) => g.isSelectedForPlay && g.isDoubleQuine
            );
            if (winGridsDoubleQuine?.length) {
              this.openWinModal(
                lastNumber,
                TirageType.Double_Quine,
                winGridsDoubleQuine
              );
            }
            break;
          case TirageType.Carton_Plein:
            const winGridsCartonPlein = this.gridsSignal()?.filter(
              (g) => g.isSelectedForPlay && g.isCartonPlein
            );
            if (winGridsCartonPlein?.length) {
              this.openWinModal(
                lastNumber,
                TirageType.Carton_Plein,
                winGridsCartonPlein
              );
            }
            break;
          default:
            break;
        }
      });
  }

  private isAlreadyWinFirstQuine(grid: Grid): boolean {
    return grid.id && this.winFirstQuineSignal()
      ? (this.winFirstQuineSignal() as string[]).includes(grid.id)
      : false;
  }

  private isAlreadyWinSecondQuine(grid: Grid): boolean {
    return grid.id && this.winSecondQuineSignal()
      ? (this.winSecondQuineSignal() as string[]).includes(grid.id)
      : false;
  }

  private isAlreadyWinThirdQuine(grid: Grid): boolean {
    return grid.id && this.winThirdQuineSignal()
      ? (this.winThirdQuineSignal() as string[]).includes(grid.id)
      : false;
  }

  public startTirage(): void {
    this.store.dispatch(new ClearTirageAction());
    this.store.dispatch(new SetTirageModeAction(TirageMode.IN_PROGRESS));
    this.tirageTypeFormcontrol.patchValue(TirageType.Quine);
    this.showKeyboard = true;
  }

  public async endTirage(): Promise<void> {
    const alert = await this.alertController.create({
      animated: true,
      header: 'Attention tirage en cours',
      message: Message.End_Tirage,
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
        },
        {
          text: 'Oui',
          handler: () => {
            this.reinitPage();
          },
        },
      ],
    });
    await alert.present();
  }

  private reinitPage(): void {
    this.store.dispatch(new UnselectAllGridsAction());
    this.store.dispatch(new SetTirageModeAction(TirageMode.INITIAL));
    this.isDisplayGrids = false;
  }

  public async demarquer(): Promise<void> {
    const alert = await this.alertController.create({
      animated: true,
      header: 'Démarquer',
      message: Message.Demarquer,
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
        },
        {
          text: 'Oui',
          handler: () => {
            this.store.dispatch(new ClearTirageAction());
            this.tirageTypeFormcontrol.setValue(TirageType.Quine);
          },
        },
      ],
    });
    await alert.present();
  }

  private async openWinModal(
    lastNumber: number,
    tirageType: TirageType,
    gridsToDisplay: Grid[]
  ): Promise<void> {
    const modal = await this.modalcontroller.create({
      component: MyGridsModalComponent,
      showBackdrop: false,
      componentProps: {
        grids: [...gridsToDisplay],
        isSelectable: false,
        lastNumber,
        isEditable: false,
        displayBadges: true,
        tirageType: this.tirageTypeFormcontrol.value,
        winNumbers: gridsToDisplay.length,
        title: tirageType,
      },
      breakpoints: [0.9],
      initialBreakpoint: 0.9,
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((res: any) => {
      if (res?.data?.tirageType) {
        this.tirageTypeFormcontrol.patchValue(res.data.tirageType);
      }
    });
    await modal.present();
  }

  public originalOrder(): number {
    return 0;
  }

  // public unselectAll(): void {
  //   this.isLoading = true;
  //   this.store.dispatch(new UnselectAllGridsAction());
  //   setTimeout(() => {
  //     this.isLoading = false;
  //   }, 0);
  // }
}
