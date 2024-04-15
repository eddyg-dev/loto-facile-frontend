import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  IonContent,
  IonSkeletonText,
  IonSpinner,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-page-loader',
  standalone: true,
  imports: [IonContent, IonSkeletonText, IonSpinner, CommonModule],
  templateUrl: './page-loader.component.html',
  styleUrl: './page-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLoaderComponent {}
