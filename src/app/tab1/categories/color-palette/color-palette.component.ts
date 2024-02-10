import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { IonIcon, PopoverController } from '@ionic/angular/standalone';
import { CategoryColor } from 'src/app/data/enum/category-color.enum';
import { CategoryColorComponent } from 'src/app/shared/ui/category-color/category-color.component';

@Component({
  selector: 'app-color-palette',
  standalone: true,
  imports: [CommonModule, CategoryColorComponent, IonIcon],
  templateUrl: './color-palette.component.html',
  styleUrl: './color-palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPaletteComponent {
  private readonly popvercontroller = inject(PopoverController);
  @Input() selectedColor?: CategoryColor;

  public categoryColorEnum = CategoryColor;

  public selectColor(color: CategoryColor): void {
    this.selectedColor = color;
    this.popvercontroller.dismiss(color);
  }
}
