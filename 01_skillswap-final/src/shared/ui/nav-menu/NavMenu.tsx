import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon, type IconName } from '../icons';
import styles from './NavMenu.module.scss';

interface Category {
  id: number;
  name: string;
  color: string; // business, creation, ...
  icon: IconName;
}

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
}

export interface NavMenuProps {
  categoriesUrl?: string; // '/db/category.json'
  subcategoriesUrl?: string; // '/db/subcategories.json'
  className?: string;
}

const NavMenu: React.FC<NavMenuProps> = ({
  categoriesUrl = '/db/category.json',
  subcategoriesUrl = '/db/subcategories.json',
  className = '',
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isSubcategoriesOpen, setIsSubcategoriesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch(categoriesUrl).then((r) => r.json()),
      fetch(subcategoriesUrl).then((r) => r.json()),
    ])
      .then(([catRes, subcategoryRes]) => {
        setCategories(catRes || []);
        setSubcategories(subcategoryRes || []);
      })
      .catch((err) => console.error('Failed to load nav data:', err));
  }, [categoriesUrl, subcategoriesUrl]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsSubcategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSubcategories = () => {
    setIsSubcategoriesOpen((prev) => !prev);
  };

  const grouped = categories.map((cat) => ({
    ...cat,
    subcategories: subcategories.filter((s) => s.categoryId === cat.id),
  }));

  return (
    <nav className={`${styles.navMenu} ${className}`} ref={menuRef}>
      <ul className={styles.list}>
        {/* Простая ссылка */}
        <li className={styles.item}>
          <Link to='/#about' className={styles.link}>
            О проекте{' '}
          </Link>
        </li>

        {/* Выпадающий пункт */}
        <li className={styles.item}>
          <button
            type='button'
            className={styles.dropdownTrigger}
            onClick={toggleSubcategories}
            aria-expanded={isSubcategoriesOpen}
          >
            Все навыки
            <Icon
              name={isSubcategoriesOpen ? 'chevronUp' : 'chevronDown'}
              className={styles.chevron}
            />
          </button>

          {isSubcategoriesOpen && (
            <div className={styles.dropdownPanel}>
              {grouped.map((group) => {
                if (group.subcategories.length === 0) return null;
                return (
                  <div key={group.id} className={styles.categoryGroup}>
                    <div className={styles.categoryHeader}>
                      <div
                        className={styles.categoryIconConatiner}
                        style={{ backgroundColor: group.color }}
                      >
                        <Icon name={group.icon} className={styles.categoryIcon} />
                      </div>
                      <span className={styles.categoryTitle}>{group.name}</span>
                    </div>
                    <div className={styles.subcategoriesGrid}>
                      {group.subcategories.map((subcategory) => (
                        <div
                          key={`${subcategory.categoryId}-${subcategory.id}`}
                          className={styles.subcategoryItem}
                        >
                          {subcategory.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavMenu;
