import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  Signal,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Message } from 'src/app/data/enum/message.enum';
import {
  AddNumberTirageAction,
  DeleteNumberTirageAction,
} from 'src/app/store/tirage/tirage.actions';
import { TirageState } from 'src/app/store/tirage/tirage.state';

@Component({
  selector: 'app-ninety-keyboard',
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonButtons,
    IonHeader,
    IonContent,
    IonTitle,
    CommonModule,
    IonToolbar,
    IonFooter,
    IonRow,
    IonCol,
    IonGrid,
    IonRow,
    IonFooter,
  ],
  templateUrl: './ninety-keyboard.component.html',
  styleUrl: './ninety-keyboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NinetyKeyboardComponent {
  private readonly modalController = inject(ModalController);
  private readonly alertController = inject(AlertController);

  @Output() public hideKeyboard = new EventEmitter();
  @Output() public demarquer = new EventEmitter();
  @Output() public endTirage = new EventEmitter();

  @Select(TirageState.getTirageNumbers)
  tirageNumbers$!: Observable<number[]>;

  private tirageNumbersSignal: Signal<number[]> = toSignal(
    this.tirageNumbers$
  ) as Signal<number[]>;

  private readonly store = inject(Store);
  public numbers = [...Array(90).keys()];

  public async addTirage(number: number): Promise<void> {
    if (!this.isInTirage(number)) {
      this.store.dispatch(new AddNumberTirageAction(number));
    } else {
      const alert = await this.alertController.create({
        animated: true,
        header: 'Annulation',
        message: `${Message.Cancel_Number} ${number} ?`,
        buttons: [
          {
            text: 'Non',
            role: 'cancel',
          },
          {
            text: 'Oui',
            handler: () => {
              this.store.dispatch(new DeleteNumberTirageAction(number));
            },
          },
        ],
      });
      await alert.present();
    }
  }

  public isInTirage(number: number): boolean {
    return this.tirageNumbersSignal().includes(number)!;
  }

  public isLast(number: number): boolean {
    return (
      this.tirageNumbersSignal()[this.tirageNumbersSignal().length - 1] ===
      number
    );
  }

  public close(): void {
    this.modalController.dismiss();
  }
}
