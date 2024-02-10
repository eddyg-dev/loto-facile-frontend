import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnInit,
  Signal,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  IonBadge,
  IonButton,
  IonCheckbox,
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
  ModalController,
} from '@ionic/angular/standalone';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CategoryColor } from 'src/app/data/enum/category-color.enum';
import { Category } from 'src/app/data/models/category';
import { Grid } from 'src/app/data/models/grid';
import { GridFull, TirageNumber } from 'src/app/data/models/grid-full';
import { CategoryState } from 'src/app/store/category/category.state';
import { EditGridAction } from 'src/app/store/grids/grids.actions';
import { TirageState } from 'src/app/store/tirage/tirage.state';
import { SaveGridComponent } from 'src/app/tab1/save-grid/save-grid.component';
import { gridToGridFull } from '../../utils/transfo.utils';

@Component({
  selector: 'app-grid-full',
  standalone: true,
  imports: [
    IonBadge,
    CommonModule,
    IonChip,
    IonIcon,
    IonButton,
    IonCheckbox,
    ReactiveFormsModule,
    IonLabel,
    IonItem,
  ],
  templateUrl: './grid-full.component.html',
  styleUrl: './grid-full.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridFullComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly modalController = inject(ModalController);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly cd$ = inject(ChangeDetectorRef);
  @Input() public grid!: Grid;
  @Input({ required: true }) public isSelectable!: boolean;
  @Input({ required: true }) public isEditable!: boolean;
  @Input({ required: true }) public displayBadges!: boolean;
  public gridFull?: GridFull;

  public backgroundColor = CategoryColor.Red;
  public isTirageInProgess = false;
  public categories$: Observable<Category[]> = this.store.select(
    CategoryState.getCategories
  );

  private categoriesSignal: Signal<Category[] | undefined> = toSignal(
    this.categories$
  );

  @Select(TirageState.getTirageNumbers)
  tirageNumbers$!: Observable<number[]>;

  public formGroup = this.fb.group({
    isSelected: false,
  });

  public ngOnInit(): void {
    this.isTirageInProgess = !this.isSelectable && !this.isEditable;
    if (this.isTirageInProgess || this.displayBadges) {
      this.tirageNumbers$
        .pipe(takeUntilDestroyed(this.destroyRef$))
        .subscribe((tirageNumbers) => {
          this.gridFull = gridToGridFull(this.grid, tirageNumbers);
          const newGrid = {
            ...this.grid,
            isQuine: this.gridFull.isQuine,
            isDoubleQuine: this.gridFull.isDoubleQuine,
            isCartonPlein: this.gridFull.isCartonPlein,
          };

          this.store.dispatch(
            new EditGridAction({
              ...newGrid,
            })
          );
          this.cd$.detectChanges();
        });
    }
    this.gridFull = gridToGridFull(this.grid);

    if (this.isSelectable) {
      this.formGroup.patchValue({
        isSelected: this.grid.isSelected,
      });
      this.formGroup.controls['isSelected'].valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef$))
        .subscribe((value) => {
          this.store.dispatch(
            new EditGridAction({ ...this.grid, isSelected: value as boolean })
          );
        });
    }

    this.backgroundColor = this.getCategory(this.grid.categoryId as string)
      ?.color as CategoryColor;
    console.log('this.backgroundColor ', this.backgroundColor);
  }

  public element(row: number, col: number): TirageNumber | undefined {
    return this.gridFull?.matrix[row][col];
  }

  public async editGrid(grid: Grid): Promise<void> {
    const modal = await this.modalController.create({
      component: SaveGridComponent,
      componentProps: {
        grid,
      },
    });
    modal.present();
  }

  public getCategory(id: string): Category | undefined {
    const cat = this.categoriesSignal()?.find((c) => id === c.id);
    return cat;
  }
}