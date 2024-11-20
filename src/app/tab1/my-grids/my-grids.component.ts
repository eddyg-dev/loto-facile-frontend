import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Signal,
  SimpleChanges,
  inject,
  signal,
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
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TirageType } from 'src/app/data/enum/tirage-type.enum';
import { Category } from 'src/app/data/models/category';
import { Grid } from 'src/app/data/models/grid';
import { CategoryColorComponent } from 'src/app/shared/ui/category-color/category-color.component';
import { GridFullComponent } from 'src/app/shared/ui/grid-full/grid-full.component';
import { PageLoaderComponent } from 'src/app/shared/ui/page-loader/page-loader.component';
import { CategoryState } from 'src/app/store/category/category.state';
import { EditGridAction } from 'src/app/store/grids/grids.actions';

@Component({
  selector: 'app-my-grids',
  standalone: true,
  imports: [
    IonSearchbar,
    IonSkeletonText,
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
    PageLoaderComponent,
  ],
  templateUrl: './my-grids.component.html',
  styleUrl: './my-grids.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyGridsComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grids']) {
      this.setGridsByCategory(changes['grids'].currentValue);
    }
  }
  private readonly store = inject(Store);
  private readonly cd = inject(ChangeDetectorRef);
  private _grids!: Grid[];
  public isLoading = signal(false);

  @Input() public tirageType!: TirageType;
  @Output() public editGridEvent = new EventEmitter<Grid>();
  @Output() public deleteGridEvent = new EventEmitter<Grid>();

  @Input({ required: true }) public isSelectableForPlay!: boolean;
  @Input() public isSelectableForEdit?: boolean;
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
    const sortedGrids = grids.sort((a, b) => {
      return (a as any).remainingNumbers - (b as any).remainingNumbers;
    });

    sortedGrids.forEach((grid) => {
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

  public selectAllCategoryChange(isChecked: boolean, id: string): void {
    if (this.isSelectableForPlay || this.isSelectableForEdit) {
      this.isLoading.set(true);
      this.gridsByCategorie[id].forEach((grid) => {
        this.store.dispatch(
          new EditGridAction({
            ...grid,
            isSelectedForPlay: this.isSelectableForPlay && isChecked,
            isSelectedForEdit: !!this.isSelectableForEdit && isChecked,
          })
        );
      });
      setTimeout(() => {
        this.isLoading.set(false);
        this.cd.detectChanges();
      }, 250);
    }
  }
}
