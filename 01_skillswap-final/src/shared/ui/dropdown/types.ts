export interface Category {
  id: number;
  name: string;
}

export interface Subcategory {
  id: number;
  categoryId: number;
  name: string;
}

export interface Skill {
  id: number;
  subcategoryId: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
}

export interface Gender {
  id: string;
  name: string;
}
