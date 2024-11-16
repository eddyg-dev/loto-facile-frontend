import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { VersionService } from '../../services/version.service';

@Component({
  selector: 'app-update-alert',
  standalone: true,
  imports: [IonButton, IonIcon],
  templateUrl: './update-alert.component.html',
  styleUrl: './update-alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateAlertComponent {
  constructor(
    private modalController: ModalController,
    private versionService: VersionService
  ) {}

  public close(): void {
    this.modalController.dismiss();
  }

  public update(): void {
    this.versionService.openUpdate();
  }
}
