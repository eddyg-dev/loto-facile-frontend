import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import {
  AlertController,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  ModalController,
} from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Message } from 'src/app/data/enum/message.enum';
import { Category } from 'src/app/data/models/category';
import { CategoryColorComponent } from 'src/app/shared/ui/category-color/category-color.component';
import { DeleteCategoryAction } from 'src/app/store/category/category.actions';
import { CategoryState } from 'src/app/store/category/category.state';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    IonList,
    IonItem,
    IonButton,
    IonLabel,
    IonIcon,
    CategoryColorComponent,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
  private readonly store = inject(Store);
  private readonly modalController = inject(ModalController);
  private readonly alertController = inject(AlertController);
  @Output() public openSaveCategoryEvent = new EventEmitter<Category>();

  public categories$: Observable<Category[]> = this.store.select(
    CategoryState.getCategories
  );

  public async deleteCategory(id: string): Promise<void> {
    const alert = await this.alertController.create({
      animated: true,
      header: 'Suppression',
      subHeader: Message.Delete_Category,
      message: Message.Delete_Category_Detail,
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
        },
        {
          text: 'Oui',
          handler: () => {
            this.store.dispatch(new DeleteCategoryAction(id));
          },
        },
      ],
    });
    await alert.present();
  }
}
