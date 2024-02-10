import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { defaultCategories } from 'src/app/data/constants/app.constants';
import { StateKey } from 'src/app/data/enum/state-key.enum';
import { Category } from 'src/app/data/models/category';
import {
  AddCategoryAction,
  DeleteCategoryAction,
  EditCategoryAction,
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
      categories: [...newCats],
    });
  }
}
