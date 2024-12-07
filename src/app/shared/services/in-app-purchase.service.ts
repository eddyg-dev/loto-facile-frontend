import { inject, Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular/standalone';
import { BehaviorSubject } from 'rxjs';
import { PremiumOfferComponent } from 'src/app/tab3/premium-offer/premium-offer.component';

@Injectable({
  providedIn: 'root',
})
export class InAppPurchaseService {
  public premiumProductId = 'lfpremium';

  private alertController = inject(AlertController);
  private modalController = inject(ModalController);

  public isPremiumUser$ = new BehaviorSubject<boolean>(false);

  constructor() {}

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

  private async showPremiumAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'LOTO FACILE PREMIUM',
      message:
        'Cette fonctionnalité est réservée aux utilisateurs premium. Souhaitez-vous passer à la version Premium ?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
        },
        {
          text: 'Oui',
          handler: () => this.openPremiumOffer(),
        },
      ],
    });
    await alert.present();
  }

  private async openPremiumOffer(): Promise<void> {
    const modal = await this.modalController.create({
      animated: true,
      showBackdrop: true,
      component: PremiumOfferComponent,
    });
    await modal.present();
  }
}
