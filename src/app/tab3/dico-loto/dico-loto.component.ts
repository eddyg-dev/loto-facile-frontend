import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { dicoNumbers } from 'src/app/data/constants/app.constants';
@Component({
  selector: 'app-dico-loto',
  standalone: true,
  imports: [
    IonButton,
    IonTitle,
    IonContent,
    IonHeader,
    IonList,
    IonLabel,
    IonItem,
    IonToolbar,
    IonListHeader,
    IonButtons,
    IonFooter,
    IonAccordion,
    IonAccordionGroup,
  ],
  templateUrl: './dico-loto.component.html',
  styleUrl: './dico-loto.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DicoLotoComponent {
  private readonly modalController = inject(ModalController);
  public dicoNumbers = dicoNumbers;
  public close(): void {
    this.modalController.dismiss();
  }
}
