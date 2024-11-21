import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { defaultCategories } from 'src/app/data/constants/app.constants';
import { CategoryId } from 'src/app/data/enum/category-id.enum';
import { StateKey } from 'src/app/data/enum/state-key.enum';
import { Category } from 'src/app/data/models/category';
import { Grid } from 'src/app/data/models/grid';
import { EditGridsAction } from '../grids/grids.actions';
import { GridState } from '../grids/grids.state';
import {
  AddCategoryAction,
  DeleteCategoryAction,
  EditCategoryAction,
  ResetCategoriesAction,
} from './category.actions';

export interface CategoryStateModel {
  categories: Category[];
}

@State({
  name: StateKey.Category,
  defaults: {
    categories: [...defaultCategories],
  },
})
@Injectable()
export class CategoryState {
  private store = inject(Store);

  @Selector()
  static getCategory(
    state: CategoryStateModel,
    id: string
  ): Category | undefined {
    return state.categories.find((c) => c.id === id);
  }

  @Selector()
  static getCategories(state: CategoryStateModel): Category[] {
    return state.categories;
  }

  @Action(AddCategoryAction)
  saveCategory(
    context: StateContext<CategoryStateModel>,
    action: AddCategoryAction
  ): void {
    context.patchState({
      ...context.getState(),
      categories: [...context.getState().categories, action.category],
    });
  }

  @Action(EditCategoryAction)
  editCategory(
    context: StateContext<CategoryStateModel>,
    action: EditCategoryAction
  ): void {
    const newCategories = context.getState().categories;
    const categoryIndex = newCategories.findIndex(
      (c) => c.id === action.category.id
    );
    newCategories[categoryIndex] = { ...action.category };
    context.patchState({
      ...context.getState(),
      categories: [...newCategories],
    });
  }

  @Action(DeleteCategoryAction)
  deleteCategory(
    context: StateContext<CategoryStateModel>,
    action: DeleteCategoryAction
  ): void {
    const index = context
      .getState()
      .categories.findIndex((c) => c.id === action.categoryId);

    const newCats = [...context.getState().categories];
    newCats.splice(index, 1);
    context.patchState({
      ...context.getState(),
      categories: [...newCats],
    });

    const grids = this.store.selectSnapshot(GridState.getGrids);
    let impactedgrids: Grid[] = grids.filter(
      (g) => g.categoryId === action.categoryId
    );
    impactedgrids.map((g) => (g.categoryId = CategoryId.Other));
    context.dispatch(new EditGridsAction(impactedgrids));
  }
  @Action(ResetCategoriesAction)
  resetCategories(
    context: StateContext<CategoryStateModel>,
    action: ResetCategoriesAction
  ): void {
    context.patchState({
      ...context.getState(),
      categories: [...defaultCategories],
    });
  }
}
