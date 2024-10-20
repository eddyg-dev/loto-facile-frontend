import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { icons } from './data/constants/app.constants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private plt: Platform,
    private alertController: AlertController,
    private ref: ChangeDetectorRef
  ) {
    addIcons(icons);
    this.initializeStore();
  }

  initializeStore() {
    this.plt.ready().then(() => {});
  }
}
