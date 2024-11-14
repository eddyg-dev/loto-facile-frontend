import { Component } from '@angular/core';

import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { icons } from './data/constants/app.constants';
import { InAppPurchaseService } from './shared/services/in-app-purchase.service';

import 'cordova-plugin-purchase';
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
    private purchaseService: InAppPurchaseService
  ) {
    addIcons(icons);
    this.setPremiumAccess(false);
    this.registerProducts();
  }

  private registerProducts(): void {
    this.platform.ready().then(() => {
      this.store = CdvPurchase.store;

      if (this.store) {
        this.store.register([
          {
            id: this.purchaseService.premiumProductId,
            type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
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
          .catch((err: any) => {});
      }
    });
  }

  private async setPremiumAccess(isPremium: boolean) {
    await this.purchaseService.setPremiumAccess(isPremium);
  }
}
