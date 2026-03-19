import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/providers/store';
import type { Subcategory } from '../../../api/types';

// Просто возвращаем массив subcategories из state
export const selectSubcategories = (state: RootState): Subcategory[] =>
  state.subcategory.subcategories;

// Находим подкатегорию по id (мемоизация)
export const selectSubcategoryById = (id: number) =>
  createSelector([selectSubcategories], (subcategories: Subcategory[]) =>
    subcategories.find((item: Subcategory) => item.id === id)
  );

// Получаем массив id подкатегорий по categoryId (мемоизация)
export const selectSubcategoryIdsByCategoryId = (categoryId: number) =>
  createSelector([selectSubcategories], (subcategories: Subcategory[]) =>
    subcategories.filter((item: Subcategory) => item.categoryId === categoryId).map((item: Subcategory) => item.id)
  );
