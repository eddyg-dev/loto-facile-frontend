import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Signal,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonIcon } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CategoryColor } from 'src/app/data/enum/category-color.enum';
import { Category } from 'src/app/data/models/category';
import { CategoryState } from 'src/app/store/category/category.state';

@Component({
  selector: 'app-category-color',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './category-color.component.html',
  styleUrl: './category-color.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryColorComponent {
  private readonly store = inject(Store);

  @Input() categoryId?: string;
  @Input() color?: CategoryColor | null;
  public categories$: Observable<Category[]> = this.store.select(
    CategoryState.getCategories
  );

  private categoriesSignal: Signal<Category[] | undefined> = toSignal(
    this.categories$
  );

  public getColor(id?: string): CategoryColor | undefined {
    if (this.color) return this.color;
    const cat = this.categoriesSignal()?.find((c) => id === c.id);
    return cat?.color;
  }
}
