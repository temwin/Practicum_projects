import type { Category, Subcategory, City, Skill, User } from './types';

const BASE_URL = '/db';

const get = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }
  return response.json();
};

export const getCategories = async (): Promise<Category[]> => {
  const data = await get<Category[]>('/category.json');
  return data;
};

export const getSubcategories = async (): Promise<Subcategory[]> => {
  const data = await get<Subcategory[]>('/subcategories.json');
  return data;
};

export const getCities = async (): Promise<City[]> => {
  const data = await get<City[] | { cities: City[] }>('/city.json');

  if (Array.isArray(data)) return data as City[];
  if (data && Array.isArray(data.cities)) return data.cities as City[];

  return [];
};

export const getSkills = async (): Promise<Skill[]> => {
  const data = await get<Skill[]>('/skills.json');
  return data;
};

export const getUsers = async (): Promise<User[]> => {
  const data = await get<User[]>('/users.json');
  return data;
};
