import type { RootState } from '../../../app/providers/store';
import type { Category } from '../../../api/types';

export const selectCategories = (state: RootState): Category[] => state.category.categories;

export const selectCategoryById =
  (id: number) =>
  (state: RootState): Category | undefined =>
    state.category.categories.find((item) => item.id === id);
