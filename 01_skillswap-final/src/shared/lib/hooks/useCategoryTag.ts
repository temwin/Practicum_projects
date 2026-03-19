import { useMemo } from 'react';
import type { TagType } from '../../ui/tag/Tag';

// Карта соответствия ID категорий -> типов тегов
const CATEGORY_TO_TAG_MAP: Record<number, TagType> = {
  1: 'business', // Бизнес и карьера
  2: 'langs', // Иностранные языки
  3: 'home', // Дом и уют
  4: 'creation', // Творчество и искусство
  5: 'education', // Образование и развитие
  6: 'health', // Здоровье и лайфстайл
};

// Функция для получения типа тега по ID категории
const getTagTypeFromCategoryId = (categoryId?: number): TagType => {
  if (!categoryId) return 'education'; // По умолчанию
  return CATEGORY_TO_TAG_MAP[categoryId] || 'education';
};

// ОСНОВНОЙ ХУК - возвращает только тип тега
export const useCategoryTag = () => {
  const getTagType = useMemo(() => {
    return (categoryId?: number): TagType => {
      return getTagTypeFromCategoryId(categoryId);
    };
  }, []);

  return getTagType;
};

// Если вдруг понадобится функция без хука
export const getTagTypeFromCategory = getTagTypeFromCategoryId;
