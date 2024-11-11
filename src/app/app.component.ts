import { ChangeDetectorRef, Component } from '@angular/core';

import {
  AlertController,
  IonApp,
  IonRouterOutlet,
  Platform,
} from '@ionic/angular/standalone';
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
  isPremiumUser: boolean = false;
  store?: CdvPurchase.Store;

  // products: IAPProduct[] = [];
  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private purchaseService: InAppPurchaseService,
    private ref: ChangeDetectorRef
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

        this.store?.products.forEach((product: any) => {
          console.log(`Product ID: ${product.id}`);
          console.log(`Owned: ${product.owned}`);
          console.log(`Title: ${product.title}`);
        });

        this.store
          .when()
          .productUpdated(() => {
            console.log('productUpdated');
          })
          .approved((transaction) => {
            console.log('approved', transaction);
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
            console.log('verified', receipt);
            receipt.finish();
          });

        this.store
          .initialize([CdvPurchase.Platform.GOOGLE_PLAY])
          .then(() => {
            // console.log('store products', JSON.stringify(this.store?.products));
          })
          .catch((err: any) => {
            // console.error('store initialize error', err);
          });
      }
    });
  }

  private async setPremiumAccess(isPremium: boolean) {
    console.log('setPremiumAccess', isPremium);
    await this.purchaseService.setPremiumAccess(isPremium);
  }
}
