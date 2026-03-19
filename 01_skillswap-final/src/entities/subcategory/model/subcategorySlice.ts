import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Subcategory } from '../../../api/types';
import { getSubcategories } from '../../../api/';

interface SubcategoryState {
  subcategories: Subcategory[];
  isLoading: boolean;
  errorText: string;
}

const initialState: SubcategoryState = {
  subcategories: [],
  isLoading: false,
  errorText: '',
};

export const fetchSubcategories = createAsyncThunk<Subcategory[]>(
  'subcategory/getSubcaterory',
  async () => {
    const data: Subcategory[] = await getSubcategories();
    return data;
  }
);

const subcategorySlice = createSlice({
  name: 'subcategory',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSubcategories.pending, (state) => {
        state.isLoading = true;
        state.errorText = '';
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subcategories = action.payload;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message || 'Ошибка при загрузке подкатегорий';
      });
  },
});

export default subcategorySlice.reducer;
