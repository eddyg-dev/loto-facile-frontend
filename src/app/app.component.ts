import { Component } from '@angular/core';

import {
  IonApp,
  IonRouterOutlet,
  ModalController,
  Platform,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { icons } from './data/constants/app.constants';
import { InAppPurchaseService } from './shared/services/in-app-purchase.service';

import 'cordova-plugin-purchase';
import { VersionService } from './shared/services/version.service';
import { UpdateAlertComponent } from './shared/ui/update-alert/update-alert.component';
declare var CdvPurchase: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  store?: CdvPurchase.Store;

  constructor(
    private platform: Platform,
    private purchaseService: InAppPurchaseService,
    private versionService: VersionService,
    private modalController: ModalController
  ) {
    this.checkForUpdate();
    addIcons(icons);
    this.setPremiumAccess(false);
    this.registerProducts();
  }

  private async checkForUpdate(): Promise<void> {
    this.versionService.needUpdate().subscribe(({ needUpdate }) => {
      console.log('needUpdate ', needUpdate);
      if (needUpdate) {
        this.presentUpdateAlert();
      }
    });
  }

  private async presentUpdateAlert(): Promise<void> {
    const alert = await this.modalController.create({
      component: UpdateAlertComponent,
      backdropDismiss: false,
      showBackdrop: true,
      initialBreakpoint: 0.5,
    });
    await alert.present();
  }

  private registerProducts(): void {
    this.platform.ready().then(() => {
      this.store = CdvPurchase.store;

      if (this.store) {
        this.store.register([
          {
            id: this.purchaseService.premiumProductId,
            type: CdvPurchase.ProductType.NON_CONSUMABLE,
            platform: CdvPurchase.Platform.GOOGLE_PLAY,
          },
        ]);

        this.store
          .when()
          .productUpdated(() => {})
          .approved((transaction) => {
            if (
              transaction.products.find(
                (p: any) => p.id === this.purchaseService.premiumProductId
              )
            ) {
              this.setPremiumAccess(true);
            }
            transaction.verify();
          })
          .verified((receipt) => {
            receipt.finish();
          });

        this.store
          .initialize([CdvPurchase.Platform.GOOGLE_PLAY])
          .then(() => {})
          .catch((err: any) => {
            console.log(err);
          });
      }
    });
  }

  private async setPremiumAccess(isPremium: boolean) {
    await this.purchaseService.setPremiumAccess(isPremium);
  }
}
