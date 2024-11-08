import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InAppPurchaseService {
  public premiumProductId = 'lotofacilepremiumintegratedproduct';

  public isPremiumUser$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  // Méthode pour mettre à jour l'état premium
  async setPremiumAccess(isPremium: boolean) {
    await localStorage.setItem('hasPremium', isPremium ? 'true' : 'false'); // Remplacez par votre méthode de stockage
    this.isPremiumUser$.next(isPremium);
  }

  // Méthode pour vérifier l'accès premium
  checkPremiumAccess() {
    // Remplacez ceci par la logique de stockage que vous utilisez
    const isPremium = localStorage.getItem('hasPremium') === 'true';
    this.setPremiumAccess(isPremium);
  }
}
