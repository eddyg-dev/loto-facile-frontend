import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Signal,
  SimpleChanges,
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
} from '@ionic/angular/standalone';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CategoryColor } from 'src/app/data/enum/category-color.enum';
import { TirageType } from 'src/app/data/enum/tirage-type.enum';
import { Category } from 'src/app/data/models/category';
import { Grid } from 'src/app/data/models/grid';
import { GridFull, TirageNumber } from 'src/app/data/models/grid-full';
import { CategoryState } from 'src/app/store/category/category.state';
import { EditGridAction } from 'src/app/store/grids/grids.actions';
import { TirageState } from 'src/app/store/tirage/tirage.state';
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
export class GridFullComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSelectableForEdit']) {
      this.ngOnInit();
    }
    if (changes['tirageType']) {
      this.updateGridFull();
    }
  }
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly cd$ = inject(ChangeDetectorRef);
  @Input() public grid!: Grid;
  @Input() public tirageType!: TirageType;
  @Input({ required: true }) public isSelectableForPlay!: boolean;
  @Input() public isSelectableForEdit?: boolean;
  @Input({ required: true }) public isEditable!: boolean;
  @Input() public isTemp = false;
  @Input() public indexTemp?: number;
  @Input({ required: true }) public displayBadges!: boolean;
  @Output() public editGridEvent = new EventEmitter<Grid>();
  @Output() public deleteGridEvent = new EventEmitter<Grid>();
  @Output() public deleteTempGrid = new EventEmitter<number>();
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
    console.log('this.grid ', this.grid);
    this.updateGridFull();

    this.isTirageInProgess = !this.isSelectableForPlay && !this.isEditable;

    if (this.isSelectableForPlay) {
      this.formGroup.patchValue({
        isSelected: this.grid.isSelectedForPlay,
      });
      this.formGroup.controls['isSelected'].valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef$))
        .subscribe((value) => {
          this.store.dispatch(
            new EditGridAction({
              ...this.grid,
              isSelectedForPlay: value as boolean,
            })
          );
        });
    } else if (this.isSelectableForEdit) {
      this.formGroup.patchValue({
        isSelected: this.grid.isSelectedForEdit,
      });
      this.formGroup.controls['isSelected'].valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef$))
        .subscribe((value) => {
          this.store.dispatch(
            new EditGridAction({
              ...this.grid,
              isSelectedForEdit: value as boolean,
            })
          );
        });
    }

    this.backgroundColor = this.getCategory(this.grid.categoryId as string)
      ?.color as CategoryColor;
  }

  public element(row: number, col: number): TirageNumber | undefined {
    return this.gridFull?.matrix[row][col];
  }

  public getCategory(id: string): Category | undefined {
    return this.categoriesSignal()?.find((c) => id === c.id);
  }

  private updateGridFull(): void {
    this.tirageNumbers$.subscribe((tirageNumbers) => {
      this.gridFull = gridToGridFull(this.grid, tirageNumbers, this.tirageType);

      const newGrid = {
        ...this.grid,
        isQuine: this.gridFull.isQuine,
        isDoubleQuine: this.gridFull.isDoubleQuine,
        isCartonPlein: this.gridFull.isCartonPlein,
        remainingNumbers: this.gridFull.remainingNumbers,
      };

      this.store.dispatch(new EditGridAction(newGrid));
      this.cd$.detectChanges();
    });
  }
}
