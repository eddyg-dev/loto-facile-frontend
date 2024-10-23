import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Category } from 'src/app/data/models/category';
import { Grid } from 'src/app/data/models/grid';
import { GridFullComponent } from 'src/app/shared/ui/grid-full/grid-full.component';
import {
  isDifferentDizaine,
  isNumbersDifferent,
  isSorted,
  isValidOneToNinety,
} from 'src/app/shared/utils/import.utils';
import { CategoryState } from 'src/app/store/category/category.state';
import {
  AddGridsAction,
  EditGridsAction,
} from 'src/app/store/grids/grids.actions';
import { v4 as guid } from 'uuid';

@Component({
  selector: 'app-save-grid',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonButtons,
    IonList,
    IonContent,
    IonInput,
    IonListHeader,
    IonLabel,
    IonTitle,
    IonItem,
    IonButton,
    FormsModule,
    GridFullComponent,
    IonSelect,
    IonSelectOption,
    IonFooter,
  ],
  templateUrl: './save-grid.component.html',
  styleUrl: './save-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveGridComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly modalController = inject(ModalController);
  @Input() grid?: Grid;

  public categories$: Observable<Category[]> = this.store.select(
    CategoryState.getCategories
  );
  numero?: string;
  category?: string;
  field1Value?: number;
  field2Value?: number;
  field3Value?: number;
  field4Value?: number;
  field5Value?: number;
  field6Value?: number;
  field7Value?: number;
  field8Value?: number;
  field9Value?: number;
  field10Value?: number;
  field11Value?: number;
  field12Value?: number;
  field13Value?: number;
  field14Value?: number;
  field15Value?: number;

  public ngOnInit(): void {
    if (this.grid) {
      this.numero = this.grid.numero;
      this.category = this.grid.categoryId;
      this.field1Value = this.grid.quines[0][0].number;
      this.field2Value = this.grid.quines[0][1].number;
      this.field3Value = this.grid.quines[0][2].number;
      this.field4Value = this.grid.quines[0][3].number;
      this.field5Value = this.grid.quines[0][4].number;
      this.field6Value = this.grid.quines[1][0].number;
      this.field7Value = this.grid.quines[1][1].number;
      this.field8Value = this.grid.quines[1][2].number;
      this.field9Value = this.grid.quines[1][3].number;
      this.field10Value = this.grid.quines[1][4].number;
      this.field11Value = this.grid.quines[2][0].number;
      this.field12Value = this.grid.quines[2][1].number;
      this.field13Value = this.grid.quines[2][2].number;
      this.field14Value = this.grid.quines[2][3].number;
      this.field15Value = this.grid.quines[2][4].number;
    }
  }

  close(grid?: Grid) {
    this.modalController.dismiss(grid);
  }

  confirm() {
    let newGrid = this.createGrid();
    if (this.grid?.id) {
      this.store.dispatch(new EditGridsAction([newGrid]));
    } else {
      newGrid = { ...newGrid, id: guid() };
      this.store.dispatch(new AddGridsAction([{ ...newGrid, id: guid() }]));
    }
    this.close(newGrid);
  }

  private createGrid(): Grid {
    return {
      categoryId: this.category as string,
      numero: this.numero as string,
      quines: [
        [
          { number: this.field1Value as number, isDrawed: false },
          { number: this.field2Value as number, isDrawed: false },
          { number: this.field3Value as number, isDrawed: false },
          { number: this.field4Value as number, isDrawed: false },
          { number: this.field5Value as number, isDrawed: false },
        ],
        [
          { number: this.field6Value as number, isDrawed: false },
          { number: this.field7Value as number, isDrawed: false },
          { number: this.field8Value as number, isDrawed: false },
          { number: this.field9Value as number, isDrawed: false },
          { number: this.field10Value as number, isDrawed: false },
        ],
        [
          { number: this.field11Value as number, isDrawed: false },
          { number: this.field12Value as number, isDrawed: false },
          { number: this.field13Value as number, isDrawed: false },
          { number: this.field14Value as number, isDrawed: false },
          { number: this.field15Value as number, isDrawed: false },
        ],
      ],
      isSelectedForPlay: false,
      isSelectedForEdit: false,
      isQuine: false,
      isDoubleQuine: false,
      isCartonPlein: false,
      id: this.grid?.id ?? undefined,
    };
  }

  public isValidOneToNinety(): boolean {
    return isValidOneToNinety(this.getAllValues());
  }

  public isNumbersDifferent(): boolean {
    return isNumbersDifferent(this.getAllValues());
  }

  public isSorted1(): boolean {
    return isSorted(
      this.field1Value as number,
      this.field2Value as number,
      this.field3Value as number,
      this.field4Value as number,
      this.field5Value as number
    );
  }
  public isSorted2(): boolean {
    return isSorted(
      this.field6Value as number,
      this.field7Value as number,
      this.field8Value as number,
      this.field9Value as number,
      this.field10Value as number
    );
  }
  public isSorted3(): boolean {
    return isSorted(
      this.field11Value as number,
      this.field12Value as number,
      this.field13Value as number,
      this.field14Value as number,
      this.field15Value as number
    );
  }
  public isDifferentDizaine1(): boolean {
    return isDifferentDizaine(
      this.field1Value as number,
      this.field2Value as number,
      this.field3Value as number,
      this.field4Value as number,
      this.field5Value as number
    );
  }
  public isDifferentDizaine2(): boolean {
    return isDifferentDizaine(
      this.field6Value as number,
      this.field7Value as number,
      this.field8Value as number,
      this.field9Value as number,
      this.field10Value as number
    );
  }

  public isDifferentDizaine3(): boolean {
    return isDifferentDizaine(
      this.field11Value as number,
      this.field12Value as number,
      this.field13Value as number,
      this.field14Value as number,
      this.field15Value as number
    );
  }

  isGridValid(): boolean {
    const rulesOK =
      !!this.numero &&
      !!this.category &&
      this.isValidOneToNinety() &&
      this.isNumbersDifferent() &&
      this.isSorted1() &&
      this.isSorted2() &&
      this.isSorted3() &&
      this.isDifferentDizaine1() &&
      this.isDifferentDizaine2() &&
      this.isDifferentDizaine3();

    if (rulesOK) {
      this.grid = this.createGrid();
    }
    return rulesOK;
  }

  private getAllValues(): (number | undefined)[] {
    return [
      this.field1Value,
      this.field2Value,
      this.field3Value,
      this.field4Value,
      this.field5Value,
      this.field6Value,
      this.field7Value,
      this.field8Value,
      this.field9Value,
      this.field10Value,
      this.field11Value,
      this.field12Value,
      this.field13Value,
      this.field14Value,
      this.field15Value,
    ];
  }

  async setFocus(element: IonInput, nextElement?: IonInput) {
    // const value = element.value as number;
    // if (!value) {
    //   return;
    // } else {
    //   if (!(value >= 1 && value <= 90)) {
    //     element.writeValue(null);
    //     return;
    //   }
    //   if (value >= 10 && value <= 90 && nextElement) {
    //     await nextElement.setFocus();
    //   }
    // }
  }
}
