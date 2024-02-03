import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { Grid } from 'src/app/data/models/grid';
import { gridToGridFull } from '../../utils/transfo.utils';
import { GridFull } from 'src/app/data/models/grid-full';
import { IonChip, ModalController } from '@ionic/angular/standalone';
import { SaveGridComponent } from 'src/app/tab1/save-grid/save-grid.component';

@Component({
  selector: 'app-grid-full',
  standalone: true,
  imports: [CommonModule, IonChip],
  templateUrl: './grid-full.component.html',
  styleUrl: './grid-full.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridFullComponent implements OnInit {
  private readonly modalController = inject(ModalController);
  @Input() public grid!: Grid;
  public gridFull?: GridFull;

  public ngOnInit(): void {
    this.gridFull = gridToGridFull(this.grid);
  }

  public element(row: number, col: number): number | undefined {
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
}
