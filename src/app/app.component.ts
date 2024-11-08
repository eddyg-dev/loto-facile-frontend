import { ChangeDetectorRef, Component } from '@angular/core';
import {
  IAPProduct,
  InAppPurchase2,
} from '@ionic-native/in-app-purchase-2/ngx';
import {
  AlertController,
  IonApp,
  IonRouterOutlet,
  Platform,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { icons } from './data/constants/app.constants';
import { InAppPurchaseService } from './shared/services/in-app-purchase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  providers: [InAppPurchase2],
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  isPremiumUser: boolean = false;
  constructor(
    private platform: Platform,
    private iap: InAppPurchase2,
    private alertController: AlertController,
    private purchaseService: InAppPurchaseService,
    private ref: ChangeDetectorRef
  ) {
    addIcons(icons);

    this.platform.ready().then(() => {
      this.initializePurchases();
      this.purchaseService.checkPremiumAccess(); // Vérifier l'accès premium
      this.purchaseService.isPremiumUser$.subscribe((isPremium) => {
        this.isPremiumUser = isPremium; // Mettre à jour l'état
      });
    });
  }

  // Initialiser l'achat intégré
  private initializePurchases() {
    this.iap.register({
      id: this.purchaseService.premiumProductId,
      type: this.iap.PAID_SUBSCRIPTION,
    });

    this.iap.ready(() => {
      console.log('InAppPurchase2 est prêt');
      this.iap.refresh(); // Rafraîchir pour récupérer l'état des achats
    });

    this.iap
      .when(this.purchaseService.premiumProductId)
      .approved(async (product: IAPProduct) => {
        product.finish();
        console.log('Achat réussi', product);
        await this.setPremiumAccess(true);
      });

    this.iap.error(async (error: any) => {
      console.error("Erreur d'achat", error);
      alert("Une erreur s'est produite lors de l'achat. Veuillez réessayer.");
    });
  }

  // Fonction pour enregistrer l'état premium dans le stockage
  private async setPremiumAccess(isPremium: boolean) {
    await this.purchaseService.setPremiumAccess(isPremium); // Mettre à jour le BehaviorSubject
  }

  // Afficher une alerte d'erreur
  // private async showErrorAlert(message: string) {
  //   const alert = await this.alertController.create({
  //     header: 'Erreur',
  //     message: message,
  //     buttons: ['OK'],
  //   });
  //   await alert.present();
  // }
}
