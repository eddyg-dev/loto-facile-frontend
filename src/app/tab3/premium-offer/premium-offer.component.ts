import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { InAppPurchaseService } from 'src/app/shared/services/in-app-purchase.service';

@Component({
  selector: 'app-premium-offer',
  standalone: true,
  imports: [
    IonItem,
    IonIcon,
    IonLabel,
    IonButton,
    IonButtons,
    IonContent,
    IonList,
    IonHeader,
    IonToolbar,
    IonTitle,
  ],
  templateUrl: './premium-offer.component.html',
  styleUrl: './premium-offer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PremiumOfferComponent {
  private readonly purchaseService = inject(InAppPurchaseService);
  private readonly modalController = inject(ModalController);
  public upgradeToPremium(): void {
    this.purchaseService.upgradeToPremium();
  }

  public close(): void {
    this.modalController.dismiss();
  }
}
