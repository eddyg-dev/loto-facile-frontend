import { inject } from '@angular/core';
import type { CanDeactivateFn } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Message } from 'src/app/data/enum/message.enum';
import { TirageMode } from 'src/app/data/enum/tirage-mode.enum';
import { TirageState } from 'src/app/store/tirage/tirage.state';
export const exitTirageGuard: CanDeactivateFn<unknown> = async () => {
  const alertController = inject(AlertController);
  const store = inject(Store);

  const tirageMode = store.selectSnapshot(TirageState.getTirageMode);
  if (tirageMode === TirageMode.IN_PROGRESS) {
    const alert = await alertController.create({
      animated: true,
      header: 'Attention tirage en cours',
      message: Message.Quit_Tirage_Page,
      buttons: [
        {
          text: 'Non',
          handler: () => {
            return { quit: false };
          },
        },
        {
          text: 'Oui',
          handler: () => {
            return { quit: true };
          },
        },
      ],
    });
    await alert.present();
    return (await alert.onDidDismiss()).data?.quit;
  } else return true;
};
