import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  addCircle,
  arrowRedo,
  book,
  bowlingBall,
  cameraOutline,
  checkboxOutline,
  close,
  closeOutline,
  create,
  cube,
  documentTextOutline,
  ellipse,
  grid,
  gridOutline,
  help,
  helpOutline,
  hourglass,
  imageOutline,
  informationCircle,
  keypad,
  library,
  libraryOutline,
  lockClosed,
  logoFacebook,
  logoInstagram,
  logoTiktok,
  mail,
  mailOutline,
  notifications,
  options,
  pencilOutline,
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
      library,
      libraryOutline,
      notifications,
      mail,
      refresh,
      cube,
      star,
      informationCircle,
      addCircle,
      checkboxOutline,
      documentTextOutline,
      imageOutline,
      cameraOutline,
      pencilOutline,
      logoFacebook,
      logoInstagram,
      logoTiktok,
      mailOutline,
      helpOutline,
      help,
      closeOutline,
      gridOutline,
    });
  }
}
