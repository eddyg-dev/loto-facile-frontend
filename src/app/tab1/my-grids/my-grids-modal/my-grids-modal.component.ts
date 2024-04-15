import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { TirageType } from 'src/app/data/enum/tirage-type.enum';
import { Grid } from 'src/app/data/models/grid';
import { MyGridsComponent } from '../my-grids.component';

@Component({
  selector: 'app-my-grids-modal',
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonIcon,
    IonToolbar,
    IonHeader,
    IonContent,
    IonTitle,
    CommonModule,
    IonButtons,
    IonButton,
    MyGridsComponent,
  ],
  templateUrl: './my-grids-modal.component.html',
  styleUrl: './my-grids-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyGridsModalComponent {
  @Input({ required: true }) grids: Grid[] = [];
  @Input({ required: true }) public isSelectableForPlay!: boolean;
  @Input({ required: true }) public isEditable!: boolean;
  @Input({ required: true }) public displayBadges!: boolean;
  @Input({ required: true }) public title = '';
  @Input({ required: true }) public winNumbers!: number;
  @Input({ required: true }) public lastNumber!: number;
  @Input({ required: true }) public tirageType!: TirageType;

  public tirageTypeEnum = TirageType;
  private readonly modalController = inject(ModalController);

  public async close(tirageType?: TirageType): Promise<void> {
    await this.modalController.dismiss({ tirageType });
  }
}
