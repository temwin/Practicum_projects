import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { City } from '../../../api/types';
import { getCities } from '../../../api/index';

interface CitiesState {
  cities: City[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CitiesState = { cities: [], isLoading: false, error: null };

export const fetchCities = createAsyncThunk<City[]>('cities/fetch', async () => {
  return await getCities();
});

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCities.pending, (s) => {
      s.isLoading = true;
      s.error = null;
    })
      .addCase(fetchCities.fulfilled, (s, a) => {
        s.isLoading = false;
        s.cities = a.payload;
      })
      .addCase(fetchCities.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.error.message ?? 'Ошибка городов';
      });
  },
});

export default citiesSlice.reducer;
