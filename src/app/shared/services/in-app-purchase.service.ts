import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InAppPurchaseService {
  public premiumProductId = 'lotofacilepremium';

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
}
