export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
}

export interface FilterTreeNode {
  id: string;
  label: string;
  children?: FilterTreeNode[];
  categoryId?: number;
  subcategoryId?: number;
}
