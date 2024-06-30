import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GridFromImageResponse } from 'src/app/data/models/grid-from-image-response';

@Injectable({
  providedIn: 'root',
})
export class OpenAiService {
  private readonly http = inject(HttpClient);

  public analyzeImage(
    base64Image: string
  ): Observable<GridFromImageResponse[]> {
    return this.http.post<GridFromImageResponse[]>('/api/analyze-image', {
      base64Image,
    });
  }
}
