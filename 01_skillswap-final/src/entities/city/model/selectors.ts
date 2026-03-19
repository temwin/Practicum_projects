import type { RootState } from '../../../app/providers/store';

export const selectAllCities = (state: RootState) => state.cities.cities;

export const selectCityById = (state: RootState, cityId: number) =>
  state.cities.cities.find((s) => s.id === cityId) ?? null;

export const selectCityIdByName = (state: RootState, cityName: string) => 
  state.cities.cities.find((c) => c.name === cityName) ?? null;  

