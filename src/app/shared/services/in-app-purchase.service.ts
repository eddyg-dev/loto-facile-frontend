import { inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { BehaviorSubject } from 'rxjs';
import { PremiumOfferComponent } from 'src/app/tab3/premium-offer/premium-offer.component';

@Injectable({
  providedIn: 'root',
})
export class InAppPurchaseService {
  public premiumProductId = 'lfpremium';
  private modalController = inject(ModalController);

  public isPremiumUser$ = new BehaviorSubject<boolean>(false);

  async setPremiumAccess(isPremium: boolean) {
    this.isPremiumUser$.next(isPremium);
  }

  upgradeToPremium() {
    const product = CdvPurchase.store.products.find(
      (p: any) => p.id === this.premiumProductId
    );
    const offer = product?.offers[0];

    if (offer) {
      CdvPurchase.store.order(offer).then(
        (product: any) => {
          console.log('Purchase successful', JSON.stringify(product));
        },
        (err: any) => {
          console.error('Purchase failed', err);
        }
      );
    }
  }

  public async openPremiumOffer(): Promise<void> {
    const modal = await this.modalController.create({
      animated: true,
      showBackdrop: true,
      component: PremiumOfferComponent,
    });
    await modal.present();
  }
}
