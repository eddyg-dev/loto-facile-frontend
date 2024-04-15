import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AlertController } from '@ionic/angular';
import { IonButton, IonIcon, IonItem } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Message } from 'src/app/data/enum/message.enum';
import { Category } from 'src/app/data/models/category';
import { Grid } from 'src/app/data/models/grid';
import { transformChaineToGrid } from 'src/app/shared/utils/import.utils';
import { CategoryState } from 'src/app/store/category/category.state';
import { AddGridsAction } from 'src/app/store/grids/grids.actions';

@Component({
  selector: 'app-import-file',
  standalone: true,
  imports: [IonButton, IonIcon, IonItem],
  templateUrl: './import-file.component.html',
  styleUrl: './import-file.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportFileComponent {
  private readonly alertController = inject(AlertController);
  private readonly store = inject(Store);
  public categories$: Observable<Category[]> = this.store.select(
    CategoryState.getCategories
  );
  private categoriesSignal: Signal<Category[] | undefined> = toSignal(
    this.categories$
  );
  public async openfileImportedAlert(event: any): Promise<void> {
    const buttons: { text: string; handler: () => void }[] = [];
    this.categoriesSignal()?.forEach((c) => {
      const button = {
        text: c.name,
        handler: () => {
          this.fileImported(event, c.id);
        },
      };
      buttons.push(button);
    });

    const alert = await this.alertController.create({
      animated: true,
      header: 'Import cartons',
      message: `${Message.Import_Which_Category} ?`,
      buttons: [...buttons],
    });
    await alert.present();
  }

  public fileImported(event: any, categoryId: string): void {
    const file = event.target.files[0];
    // "text/csv"
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const format = file.type;
      const csvText = e.target.result as string;
      let grids = transformChaineToGrid(csvText, categoryId) as Grid[];
      this.store.dispatch(new AddGridsAction(grids));
    };
    reader.readAsText(file);
  }

  public async openImportInfo(): Promise<void> {
    const alert = await this.alertController.create({
      animated: true,
      header: 'Infos sur les imports ',
      message: `${Message.Import_Which_Category} ?`,
    });
    await alert.present();
  }
}
