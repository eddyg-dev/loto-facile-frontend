import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ModalController,
  PopoverController,
} from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { CategoryColor } from 'src/app/data/enum/category-color.enum';
import { Category } from 'src/app/data/models/category';
import { CategoryColorComponent } from 'src/app/shared/ui/category-color/category-color.component';
import {
  AddCategoryAction,
  EditCategoryAction,
} from 'src/app/store/category/category.actions';
import { v4 as uuidv4 } from 'uuid';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';

@Component({
  selector: 'app-save-category',
  standalone: true,
  imports: [
    CommonModule,
    IonList,
    IonInput,
    IonItem,
    IonContent,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonSelect,
    IonSelectOption,
    IonLabel,
    CategoryColorComponent,
    ReactiveFormsModule,
    IonIcon,
  ],
  templateUrl: './save-category.component.html',
  styleUrl: './save-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveCategoryComponent implements OnInit {
  @Input() category?: Category;
  private readonly store = inject(Store);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly modalController = inject(ModalController);
  private readonly popovercontroller = inject(PopoverController);
  private readonly fb = inject(FormBuilder);

  public categoryColorEnum = CategoryColor;
  public categoryForm = this.fb.group({
    name: ['', Validators.required],
    color: [CategoryColor.Blue, Validators.required],
  });

  public ngOnInit(): void {
    if (this.category) {
      this.categoryForm.patchValue({
        color: this.category.color,
        name: this.category.name,
      });
    }
  }

  public close(): void {
    this.modalController.dismiss();
  }

  public async openColorPalette(color?: CategoryColor | null): Promise<void> {
    const palette = await this.popovercontroller.create({
      component: ColorPaletteComponent,
      componentProps: {
        selectedColor: color,
      },
    });

    palette.onDidDismiss().then((result) => {
      if (result?.data) {
        this.categoryForm.controls['color'].patchValue(
          result.data as any as CategoryColor
        );
        this.cd.detectChanges();
      }
    });
    await palette.present();
  }

  public validate(): void {
    const newCat: Category = {
      id: uuidv4(),
      name: this.categoryForm.value.name as string,
      color: this.categoryForm.value.color as CategoryColor,
      isDeletable:
        this.category && this.category.isDeletable === false ? false : true,
    };

    this.store.dispatch(
      this.category
        ? new EditCategoryAction({ ...newCat, id: this.category.id })
        : new AddCategoryAction(newCat)
    );
    this.modalController.dismiss();
  }
}
