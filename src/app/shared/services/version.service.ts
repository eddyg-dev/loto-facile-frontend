import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  private readonly http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  public needUpdate(): Observable<{ needUpdate: boolean }> {
    return this.http.get<{ needUpdate: boolean }>(
      `${this.baseUrl}/need-update`,
      {
        params: { version: environment.version },
      }
    );
  }

  public openUpdate(): void {
    Browser.open({ url: environment.playstore });
  }
}
