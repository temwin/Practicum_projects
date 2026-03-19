import React, { useState, useRef, useEffect } from 'react';
import { Checkbox, type CheckboxState } from '../checkbox';
import { Icon } from '../icons';
import styles from './Multiselect.module.scss';

type CategoryDto = { id: number; name: string };
type SubcategoryDto = { id: number; name: string; categoryId: number };

export interface MultiselectProps {
  label?: string;
  placeholder?: string;
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
  categoriesUrl?: string;
  subcategoriesUrl?: string;
  categoryId?: number | number[];
  className?: string;
  disabled?: boolean;
}

const Multiselect: React.FC<MultiselectProps> = ({
  label,
  placeholder = 'Выберите значение',
  selectedIds = [],
  onSelectionChange,
  categoriesUrl,
  subcategoriesUrl,
  categoryId,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<{ id: number; label: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      let data: { id: number; label: string }[] = [];

      if (categoriesUrl) {
        const res: unknown = await fetch(categoriesUrl).then((r) => r.json());
        const list: CategoryDto[] = Array.isArray(res) ? (res as CategoryDto[]) : [];
        data = list.map((cat) => ({ id: cat.id, label: cat.name }));
      } else if (subcategoriesUrl) {
        const res: unknown = await fetch(subcategoriesUrl).then((r) => r.json());
        const all: SubcategoryDto[] = Array.isArray(res) ? (res as SubcategoryDto[]) : [];

        const categoryIds = Array.isArray(categoryId)
          ? categoryId
          : categoryId
            ? [categoryId]
            : null;

        const filtered = categoryIds ? all.filter((s) => categoryIds.includes(s.categoryId)) : all;

        data = filtered.map((subcat) => ({ id: subcat.id, label: subcat.name }));
      }

      setItems(data);
    };

    load().catch(console.error);
  }, [categoriesUrl, subcategoriesUrl, categoryId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOpen = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (id: number, newState: CheckboxState) => {
    if (newState === 'checked') onSelectionChange?.([...selectedIds, id]);
    else onSelectionChange?.(selectedIds.filter((i) => i !== id));
  };

  const displayText = selectedIds.length > 0 ? `Выбрано: ${selectedIds.length}` : placeholder;
  const hasValue = items.length > 0;

  return (
    <div className={`${styles.container} ${className}`} ref={containerRef}>
      {label && <div className={styles.label}>{label}</div>}

      <div
        className={`${styles.control} ${hasValue ? styles.hasValue : ''} ${disabled ? styles.disabled : ''} ${isOpen ? styles.isOpen : ''}`}
        onClick={toggleOpen}
      >
        <span>{displayText}</span>
        <Icon name={isOpen ? 'chevronUp' : 'chevronDown'} />
      </div>

      {isOpen && (
        <div className={`${styles.menu} ${styles.isOpen}`}>
          <div className={styles.menu__container}>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                <Checkbox
                  state={selectedIds.includes(item.id) ? 'checked' : 'empty'}
                  onChange={(newState) => handleCheckboxChange(item.id, newState)}
                  label={item.label}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Multiselect;
export { Multiselect };
