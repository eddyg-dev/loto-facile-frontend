import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GridFromImageResponse } from 'src/app/data/models/grid-from-image-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenAiService {
  private readonly http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  public analyzeImage(
    base64Image: string
  ): Observable<GridFromImageResponse[]> {
    return of([
      {
        numero: 1,
        quines: [
          [11, 36, 59, 69, 87],
          [19, 23, 41, 55, 74],
          [7, 22, 44, 62, 81],
        ],
      },
      {
        numero: 2,
        quines: [
          [11, 36, 59, 69, 87],
          [19, 23, 41, 55, 74],
          [7, 22, 44, 62, 81],
        ],
      },
      {
        numero: 3,
        quines: [
          [11, 36, 59, 69, 87],
          [19, 23, 41, 55, 74],
          [7, 22, 44, 62, 81],
        ],
      },
      {
        numero: 4,
        quines: [
          [11, 36, 59, 69, 87],
          [19, 23, 41, 55, 74],
          [7, 22, 44, 62, 81],
        ],
      },
      {
        numero: 1,
        quines: [
          [11, 36, 59, 69, 87],
          [19, 23, 41, 55, 74],
          [7, 22, 44, 62, 81],
        ],
      },
    ]);
    return this.http.post<GridFromImageResponse[]>(`${this.baseUrl}/analyze`, {
      base64Image,
      fileType: 'image',
    });
  }

  // Nouvelle méthode pour l'analyse de fichiers (PDF, CSV, Excel)
  public analyzeFile(formData: FormData): Observable<GridFromImageResponse[]> {
    return this.http.post<GridFromImageResponse[]>(
      `${this.baseUrl}/analyze-file`,
      formData
    );
  }
}
