import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { StateKey } from './app/data/enum/state-key.enum';
import { InAppPurchaseService } from './app/shared/services/in-app-purchase.service';
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
    provideHttpClient(withInterceptors([apiKeyInterceptor])),
    importProvidersFrom(
      NgxsModule.forRoot([GridState, TirageState, CategoryState]),
      NgxsReduxDevtoolsPluginModule.forRoot(),
      NgxsStoragePluginModule.forRoot({
        key: [StateKey.Grids, StateKey.Tirage, StateKey.Category],
      })
    ),
    InAppPurchaseService,
  ],
});

export function apiKeyInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const apiKey = environment.apiKey;
  const clonedReq = req.clone({
    headers: req.headers.set('x-api-key', apiKey),
  });
  return next(clonedReq);
}
