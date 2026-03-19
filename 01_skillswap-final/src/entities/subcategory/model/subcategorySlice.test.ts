import { expect, test, describe, beforeEach } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { type RootState } from '../../../app/providers/store';
import type { Subcategory } from '../../../api/types';
import { subcategoryReducer, selectSubcategories, selectSubcategoryById } from './index';

describe('тесты селекторов', () => {
  let store: ReturnType<typeof configureStore>;

  const initialSubcategories: Subcategory[] = [
    { id: 1, categoryId: 1, name: 'Управление командой' },
    { id: 2, categoryId: 1, name: 'Маркетинг и реклама' },
    { id: 9, categoryId: 2, name: 'Английский' },
    { id: 10, categoryId: 2, name: 'Французский' },
  ];

  beforeEach(() => {
    store = configureStore({
      reducer: { subcategory: subcategoryReducer },
      preloadedState: {
        subcategory: {
          subcategories: initialSubcategories,
          isLoading: false,
          errorText: '',
        },
      },
    });
  });

  test('получение всех категорий', () => {
    const state = store.getState() as RootState;
    const expectedData = initialSubcategories;
    const cateoriesAll: Subcategory[] = selectSubcategories(state);
    expect(cateoriesAll).toEqual(expectedData);
  });
  test('получение категории по Id', () => {
    const state = store.getState() as RootState;
    const expectedData = {
      id: 2,
      categoryId: 1,
      name: 'Маркетинг и реклама',
    };
    const subcategoryById: Subcategory | undefined = selectSubcategoryById(2)(state);
    expect(subcategoryById).toEqual(expectedData);
  });
});
