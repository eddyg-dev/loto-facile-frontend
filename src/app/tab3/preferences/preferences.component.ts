import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GridNumberFontSize } from 'src/app/data/enum/grid-number-font-size.enum';
import { Preferences } from 'src/app/data/models/preference';
import { EditPreferencesAction } from 'src/app/store/grids/grids.actions';
import { GridState } from 'src/app/store/grids/grids.state';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonTitle,
    IonHeader,
    IonSelect,
    IonSelectOption,
    FormsModule,
    IonButton,
    IonIcon,
    IonButtons,
  ],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferencesComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly modalController = inject(ModalController);
  public preferences$: Observable<Preferences> = this.store.select(
    GridState.getPreferences
  );

  public gridNumberFontSizeEnum = GridNumberFontSize;
  public zoomGrid: GridNumberFontSize = GridNumberFontSize.Small;
  public close(): void {
    this.modalController.dismiss();
  }
  ngOnInit(): void {
    this.preferences$.subscribe((preferences) => {
      this.zoomGrid = preferences?.zoomGrid ?? GridNumberFontSize.Small;
    });
  }

  public onZoomGridChange(event: CustomEvent): void {
    this.store.dispatch(
      new EditPreferencesAction({
        zoomGrid: event.detail.value ?? GridNumberFontSize.Medium,
      })
    );
  }
}
