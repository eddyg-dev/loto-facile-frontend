import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this.http.post<GridFromImageResponse[]>(`${this.baseUrl}/analyze`, {
      base64Image,
      fileType: 'image',
    });
  }

  public analyzeFile(formData: FormData): Observable<GridFromImageResponse[]> {
    return this.http.post<GridFromImageResponse[]>(
      `${this.baseUrl}/analyze`,
      formData
    );
  }
}
