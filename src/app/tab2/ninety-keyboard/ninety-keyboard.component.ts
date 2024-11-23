import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Signal,
  SimpleChanges,
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
export class NinetyKeyboardComponent implements OnChanges {
  private readonly modalController = inject(ModalController);
  private readonly cd = inject(ChangeDetectorRef);

  @Input() public isManual = false;
  @Input() public values: (number | undefined)[] = [];

  @Input() public hasHeader = false;

  @Output() public hideKeyboard = new EventEmitter();
  @Output() public endTirage = new EventEmitter();
  @Output() public demarquer = new EventEmitter();
  @Output() public clickOnNumber = new EventEmitter();

  @Select(TirageState.getTirageNumbers)
  tirageNumbers$!: Observable<number[]>;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['values']) {
      this.values = changes['values'].currentValue;
      this.cd.detectChanges();
    }
  }
  private tirageNumbersSignal: Signal<number[]> = toSignal(
    this.tirageNumbers$
  ) as Signal<number[]>;

  private readonly store = inject(Store);
  public numbers = [...Array(90).keys()];

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

  public isDisabled(number: number): boolean {
    return (
      this.isInTirage(number) || (this.isManual && this.values.includes(number))
    );
  }

  public onClickNumber(number: number): void {
    if (this.isManual && this.values.includes(number)) {
      return;
    }
    this.clickOnNumber.emit(number);
  }
}
