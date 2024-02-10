import { CategoryColor } from '../enum/category-color.enum';

export interface Category {
  id: string;
  name: string;
  color: CategoryColor;
  isDeletable: boolean;
}
