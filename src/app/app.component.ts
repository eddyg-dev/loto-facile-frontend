import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  addCircle,
  arrowRedo,
  book,
  bowlingBall,
  checkboxOutline,
  close,
  create,
  cube,
  ellipse,
  grid,
  hourglass,
  informationCircle,
  keypad,
  lockClosed,
  mail,
  notifications,
  options,
  refresh,
  square,
  squareOutline,
  squareSharp,
  star,
  trash,
  triangle,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({
      triangle,
      ellipse,
      square,
      squareOutline,
      squareSharp,
      create,
      close,
      trash,
      lockClosed,
      grid,
      bowlingBall,
      options,
      keypad,
      hourglass,
      add,
      arrowRedo,
      book,
      notifications,
      mail,
      refresh,
      cube,
      star,
      informationCircle,
      addCircle,
      checkboxOutline,
    });
  }
}
