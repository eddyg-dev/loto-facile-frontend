import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { ClearTirageAction } from '../store/tirage/tirage.actions';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  private router = inject(Router);
  private store = inject(Store);
  public tab = '';
  public tabChange(event: any): void {
    this.tab = event.tab;
    this.router.navigate([`tabs/${event.tab}`]);
    this.store.dispatch(new ClearTirageAction());
  }
}
