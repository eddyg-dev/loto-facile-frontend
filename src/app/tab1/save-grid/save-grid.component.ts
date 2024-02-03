import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Grid } from 'src/app/data/models/grid';

@Component({
  selector: 'app-save-grid',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonList,
    IonContent,
    IonInput,
    IonListHeader,
    IonLabel,
    IonTitle,
    IonItem,
    IonButton,
    FormsModule,
  ],
  templateUrl: './save-grid.component.html',
  styleUrl: './save-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveGridComponent implements OnInit {
  private readonly modalController = inject(ModalController);
  @Input() grid?: Grid;

  numero?: number;
  field1Value?: number;
  field2Value?: number;
  field3Value?: number;
  field4Value?: number;
  field5Value?: number;
  field6Value?: number;
  field7Value?: number;
  field8Value?: number;
  field9Value?: number;
  field10Value?: number;
  field11Value?: number;
  field12Value?: number;
  field13Value?: number;
  field14Value?: number;
  field15Value?: number;

  public ngOnInit(): void {
    console.log(this.grid);

    if (this.grid) {
      this.numero = this.grid.numero;
      this.field1Value = this.grid.quines[0][0];
      this.field2Value = this.grid.quines[0][1];
      this.field3Value = this.grid.quines[0][2];
      this.field4Value = this.grid.quines[0][3];
      this.field5Value = this.grid.quines[0][4];
      this.field6Value = this.grid.quines[1][0];
      this.field7Value = this.grid.quines[1][1];
      this.field8Value = this.grid.quines[1][2];
      this.field9Value = this.grid.quines[1][3];
      this.field10Value = this.grid.quines[1][4];
      this.field11Value = this.grid.quines[2][0];
      this.field12Value = this.grid.quines[2][1];
      this.field13Value = this.grid.quines[2][2];
      this.field14Value = this.grid.quines[2][3];
      this.field15Value = this.grid.quines[2][4];
    }
  }

  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  confirm() {
    console.log(this.numero);

    // return this.modalController.dismiss(this., 'confirm');
  }

  async setFocus(element: IonInput, nextElement: IonInput) {
    const value = element.value as number;
    if (!value) {
      return;
    } else {
      if (!(value >= 1 && value <= 90)) {
        element.writeValue(null);
        return;
      }
      if (value >= 10 && value <= 90) {
        await nextElement.setFocus();
      }
    }
  }
}
