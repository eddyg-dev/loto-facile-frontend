import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GridNumberFontSize } from 'src/app/data/enum/grid-number-font-size.enum';
import { StateKey } from 'src/app/data/enum/state-key.enum';
import { Grid } from 'src/app/data/models/grid';
import { Preferences } from 'src/app/data/models/preference';
import { InAppPurchaseService } from 'src/app/shared/services/in-app-purchase.service';
import {
  AddGridsAction,
  DeleteAllGridsAction,
  DeleteGridAction,
  DeleteGridsAction,
  EditGridAction,
  EditGridsAction,
  EditPreferencesAction,
  UnselectAllGridsAction,
} from './grids.actions';

export interface GridStateModel {
  grids: Grid[];
  preferences: Preferences;
}

@State({
  name: StateKey.Grids,
  defaults: {
    grids: [],
    preferences: {
      zoomGrid: GridNumberFontSize.Medium,
    },
  },
})
@Injectable()
export class GridState {
  private readonly GRID_LIMIT = 5; // Limite pour les utilisateurs gratuits

  constructor(
    private alertController: AlertController,
    private purchaseService: InAppPurchaseService
  ) {}

  @Selector()
  static getGrids(state: GridStateModel): Grid[] {
    return state.grids;
  }
  @Selector()
  static getPreferences(state: GridStateModel): Preferences {
    return state.preferences;
  }

  @Action(AddGridsAction)
  async saveGrids(
    context: StateContext<GridStateModel>,
    action: AddGridsAction
  ): Promise<void> {
    const totalGrids = context.getState().grids.length + action.grids.length;
    console.log('totalGrids', totalGrids);
    const isPremiumUser = this.purchaseService.isPremiumUser$.value;
    console.log('isPremiumUser', isPremiumUser);

    if (!isPremiumUser && totalGrids > this.GRID_LIMIT) {
      await this.showPremiumAlert(
        `Le nombre de grilles que vous pouvez créer est limité à ${this.GRID_LIMIT}.
        Si vous souhaitez créer plus de grilles sans limite, vous pouvez passer à la version Premium.
        Souhaitez-vous passer à la version Premium ?`
      );
      return;
    }

    context.patchState({
      grids: [...context.getState().grids, ...action.grids],
    });
  }

  @Action(EditGridsAction)
  editGrids(
    context: StateContext<GridStateModel>,
    action: EditGridsAction
  ): void {
    const newGrids = context.getState().grids;
    action.grids.forEach((newGrid) => {
      const index = newGrids.findIndex((g) => g.id === newGrid.id);
      if (index > -1) {
        newGrids[index] = { ...newGrid };
      }
    });
    context.patchState({
      grids: [...newGrids],
    });
  }

  @Action(DeleteGridsAction)
  deleteGrids(
    context: StateContext<GridStateModel>,
    action: DeleteGridsAction
  ): void {
    const newgrids = context
      .getState()
      .grids.filter((g) => !(g.id && action.gridIds.includes(g.id)));
    context.patchState({
      grids: [...newgrids],
    });
  }

  @Action(EditGridAction)
  editGrid(
    context: StateContext<GridStateModel>,
    action: EditGridAction
  ): void {
    const newGrids = context.getState().grids;
    const gridIndex = newGrids.findIndex((g) => g.id === action.editedGrid.id);
    newGrids[gridIndex] = { ...action.editedGrid };
    context.patchState({
      grids: [...newGrids],
    });
  }

  @Action(UnselectAllGridsAction)
  unselectAllGrids(context: StateContext<GridStateModel>): void {
    context.patchState({
      grids: context.getState().grids.map((grid) => {
        grid.isSelectedForPlay = false;
        grid.isSelectedForEdit = false;
        return grid;
      }),
    });
  }
  @Action(DeleteAllGridsAction)
  deleteAllGrids(context: StateContext<GridStateModel>): void {
    context.patchState({
      grids: [],
    });
  }

  @Action(DeleteGridAction)
  deleteGrid(
    context: StateContext<GridStateModel>,
    action: DeleteGridAction
  ): void {
    const index = context
      .getState()
      .grids.findIndex((g) => g.id === action.gridId);

    const newGrids = [...context.getState().grids];
    newGrids.splice(index, 1);
    context.patchState({
      grids: [...newGrids],
    });
  }

  @Action(EditPreferencesAction)
  editPreferences(
    context: StateContext<GridStateModel>,
    action: EditPreferencesAction
  ): void {
    context.patchState({
      preferences: { ...context.getState().preferences, ...action.preferences },
    });
  }

  private async showPremiumAlert(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'LOTO FACILE PREMIUM',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
    alert.onDidDismiss().then(() => {
      this.purchaseService.openPremiumOffer();
    });
  }
}
