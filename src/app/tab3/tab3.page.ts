import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Browser } from '@capacitor/browser';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonTitle,
  IonToggle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { Message } from '../data/enum/message.enum';
import { InAppPurchaseService } from '../shared/services/in-app-purchase.service';
import { ResetCategoriesAction } from '../store/category/category.actions';
import { DeleteAllGridsAction } from '../store/grids/grids.actions';
import { ClearTirageAction } from '../store/tirage/tirage.actions';
import { DicoLotoComponent } from './dico-loto/dico-loto.component';
import { PremiumOfferComponent } from './premium-offer/premium-offer.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonNote,
    IonToggle,
    IonList,
    IonListHeader,
    IonLabel,
    IonIcon,
    IonButton,
    IonItem,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    IonFooter,
    IonToggle,
    IonButtons,
    AsyncPipe,
  ],
})
export class Tab3Page {
  private store = inject(Store);

  private alertController = inject(AlertController);
  private modalController = inject(ModalController);
  private purchaseService = inject(InAppPurchaseService);

  public isPremium = this.purchaseService.isPremiumUser$;

  public contactEmail = environment.email;

  public version = environment.version;

  public async resetAllDatas(): Promise<void> {
    const alert = await this.alertController.create({
      animated: true,
      header: 'Réinitialisation',
      message: Message.Delete_All_Datas,
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
        },
        {
          text: 'Oui',
          handler: () => {
            this.store.dispatch(new DeleteAllGridsAction());
            this.store.dispatch(new ClearTirageAction());
            this.store.dispatch(new ResetCategoriesAction());
          },
        },
      ],
    });
    await alert.present();
  }

  public async openDicoLoto(): Promise<void> {
    const modal = await this.modalController.create({
      animated: true,
      component: DicoLotoComponent,
    });
    await modal.present();
  }

  public async openFacebookPage(): Promise<void> {
    await Browser.open({
      url: environment.facebookPageUrl,
    });
  }

  public async openWhatsapp(): Promise<void> {
    const message = 'Bonjour, j’ai une question concernant votre application !';
    const url = `${environment.whatsappUrl}?text=${message}`;
    await Browser.open({ url });
  }

  public unsubscribe(): void {
    // CdvPurchase.store.cancel();
  }

  public async clickOnFormula(): Promise<void> {
    if (this.purchaseService.isPremiumUser$.value) {
      const modal = await this.modalController.create({
        animated: true,
        component: PremiumOfferComponent,
      });
      await modal.present();
    } else {
      const modal = await this.modalController.create({
        animated: true,
        component: PremiumOfferComponent,
      });
      await modal.present();
    }
  }

  public async evaluateApp(): Promise<void> {
    await Browser.open({ url: environment.playstore });
  }
}
