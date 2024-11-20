import { inject, Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Message } from 'src/app/data/enum/message.enum';
import { DeleteNumberTirageAction } from 'src/app/store/tirage/tirage.actions';

@Injectable({
  providedIn: 'root',
})
export class TirageService {
  private readonly alertController = inject(AlertController);
  private readonly store = inject(Store);

  public async confirmDeleteNumber(number: number): Promise<void> {
    const alert = await this.alertController.create({
      animated: true,
      header: 'Annulation',
      message: `${Message.Cancel_Number} ${number} ?`,
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
        },
        {
          text: 'Oui',
          handler: () => {
            this.store.dispatch(new DeleteNumberTirageAction(number));
          },
        },
      ],
    });
    await alert.present();
  }
}
