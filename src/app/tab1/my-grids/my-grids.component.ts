import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  Signal,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  IonButton,
  IonCheckbox,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Category } from 'src/app/data/models/category';
import { Grid } from 'src/app/data/models/grid';
import { CategoryColorComponent } from 'src/app/shared/ui/category-color/category-color.component';
import { GridFullComponent } from 'src/app/shared/ui/grid-full/grid-full.component';
import { CategoryState } from 'src/app/store/category/category.state';
import { EditGridAction } from 'src/app/store/grids/grids.actions';

@Component({
  selector: 'app-my-grids',
  standalone: true,
  imports: [
    IonListHeader,
    IonItem,
    IonInput,
    CommonModule,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonList,
    GridFullComponent,
    IonListHeader,
    IonLabel,
    CategoryColorComponent,
    IonCheckbox,
  ],
  templateUrl: './my-grids.component.html',
  styleUrl: './my-grids.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyGridsComponent {
  private readonly store = inject(Store);
  private readonly cd = inject(ChangeDetectorRef);
  private _grids!: Grid[];

  @Input({ required: true }) public isSelectable!: boolean;
  @Input({ required: true }) public isEditable!: boolean;
  @Input({ required: true }) public displayBadges!: boolean;

  gridsByCategorie: { [categorie: string]: Grid[] } = {};

  public categories$: Observable<Category[]> = this.store.select(
    CategoryState.getCategories
  );

  private categoriesSignal: Signal<Category[] | undefined> = toSignal(
    this.categories$
  );

  @Input()
  set grids(grids: Grid[]) {
    this._grids = grids;
    this.setGridsByCategory(grids);
  }

  get grids(): Grid[] {
    return this._grids;
  }

  private setGridsByCategory(grids: Grid[]) {
    this.gridsByCategorie = {};
    grids.forEach((grid) => {
      if (!this.gridsByCategorie[grid.categoryId]) {
        this.gridsByCategorie[grid.categoryId] = [grid];
      } else {
        this.gridsByCategorie[grid.categoryId].push(grid);
      }
    });
  }

  public getCategory(id: string): Category | undefined {
    const cat = this.categoriesSignal()?.find((c) => id === c.id);
    return cat;
  }

  public selectAllCategory(id: string): void {
    if (this.isSelectable) {
      this.gridsByCategorie[id].forEach((grid) => {
        this.store.dispatch(new EditGridAction({ ...grid, isSelected: true }));
        this.cd.detectChanges();
      });
    }
  }
}
