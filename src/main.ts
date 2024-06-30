import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { provideHttpClient } from '@angular/common/http';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { StateKey } from './app/data/enum/state-key.enum';
import { CategoryState } from './app/store/category/category.state';
import { GridState } from './app/store/grids/grids.state';
import { TirageState } from './app/store/tirage/tirage.state';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      NgxsModule.forRoot([GridState, TirageState, CategoryState]),
      NgxsReduxDevtoolsPluginModule.forRoot(),
      NgxsStoragePluginModule.forRoot({
        key: [StateKey.Grids, StateKey.Tirage, StateKey.Category],
      })
    ),
  ],
});
