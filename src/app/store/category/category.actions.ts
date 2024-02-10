import { Category } from 'src/app/data/models/category';

export class AddCategoryAction {
  static readonly type = '[Category] Add Category';
  constructor(public category: Category) {}
}

export class EditCategoryAction {
  static readonly type = '[Category] Edit Category';
  constructor(public category: Category) {}
}
export class DeleteCategoryAction {
  static readonly type = '[Category] Delete Category';
  constructor(public categoryId: string) {}
}
