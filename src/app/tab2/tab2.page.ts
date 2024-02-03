import { Component } from '@angular/core';
import {
  IonContent,
  IonFooter,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TirageComponent } from './tirage/tirage.component';
import { NinetyKeyboardComponent } from './ninety-keyboard/ninety-keyboard.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    TirageComponent,
    IonFooter,
    NinetyKeyboardComponent,
  ],
})
export class Tab2Page {
  constructor() {}
}
