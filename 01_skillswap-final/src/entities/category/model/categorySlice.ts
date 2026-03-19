import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Category } from '../../../api/types';
import { getCategories } from '../../../api/';

export interface СategoryState {
  categories: Category[];
  isLoading: boolean;
  errorText: string;
}

const initialState: СategoryState = {
  categories: [],
  isLoading: false,
  errorText: '',
};

export const fetchCategories = createAsyncThunk<Category[]>(
  'category/fetchCategories',
  async () => {
    const data: Category[] = await getCategories();
    return data;
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.errorText = '';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message || 'Ошибка при загрузке категорий';
      });
  },
});

export default categorySlice.reducer;
