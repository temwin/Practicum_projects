import type { Category, Subcategory, FilterTreeNode } from './types';

export function buildFilterTree(
  categories: Category[] = [],
  subcategories: Subcategory[] = []
): FilterTreeNode[] {
  if (!Array.isArray(categories) || !Array.isArray(subcategories)) {
    console.error('Invalid data format in buildFilterTree', { categories, subcategories });
    return [];
  }
  return categories.map((cat) => {
    const children = subcategories
      .filter((sub) => sub.categoryId === cat.id)
      .map((sub) => ({
        id: `sub_${sub.id}`,
        label: sub.name,
        subcategoryId: sub.id,
        categoryId: cat.id,
      }));
    return {
      id: `cat_${cat.id}`,
      label: cat.name,
      children: children.length ? children : undefined,
      categoryId: cat.id,
    };
  });
}
