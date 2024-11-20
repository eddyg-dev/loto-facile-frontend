import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastController = inject(ToastController);

  public async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      color: 'danger',
    });
    await toast.present();
  }
}
