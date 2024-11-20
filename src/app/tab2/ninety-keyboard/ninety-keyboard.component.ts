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
import { TirageService } from 'src/app/shared/services/tirage.service';
import { AddNumberTirageAction } from 'src/app/store/tirage/tirage.actions';
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
  private readonly tirageService = inject(TirageService);

  @Output() public hideKeyboard = new EventEmitter();
  @Output() public demarquer = new EventEmitter();

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
      await this.tirageService.confirmDeleteNumber(number);
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
