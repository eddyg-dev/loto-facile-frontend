import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  IonGrid,
  IonCol,
  IonRow,
  IonFooter,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ninety-keyboard',
  standalone: true,
  imports: [
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
  public numbers = [...Array(90).keys()];

  public addTirage(number: number): void {}
}
