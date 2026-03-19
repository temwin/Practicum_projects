import { useMemo, useState } from 'react';
import styles from './FiltersPanel.module.scss';
import SvgCross from '../../shared/ui/icons/svg/Cross';
import { FilterTree } from '../../shared/ui/filter-tree/FilterTree';
import { RadioButton } from '../../shared/ui/radio/RadioButton';

import type { FiltersValue, SkillType, Gender, SelectedItem } from '../../pages/MainPage/types';

type Props = {
  value: FiltersValue;
  onChange: (next: FiltersValue) => void;
};

function FiltersPanel({ value, onChange }: Props) {
  // resetKey нужен только для того, чтобы "перемонтировать" FilterTree
  const [resetCounter, setResetCounter] = useState(0);

  const skillVariants = [
    { label: 'Всё', value: 'all' },
    { label: 'Хочу научиться', value: 'learn' },
    { label: 'Могу научить', value: 'teach' },
  ] as const;

  const genderVariants = [
    { label: 'Не имеет значения', value: 'all' },
    { label: 'Мужской', value: 'male' },
    { label: 'Женский', value: 'female' },
  ] as const;

  const handleResetFilters = () => {
    onChange({
      skillType: 'all',
      gender: 'all',
      selectedSkills: [],
      selectedCities: [],
    });
    setResetCounter((c) => c + 1);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;

    count += (value.selectedSkills ?? []).length;
    count += (value.selectedCities ?? []).length;

    if (value.skillType !== 'all') count += 1;
    if (value.gender !== 'all') count += 1;

    return count;
  }, [value]);

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <aside className={styles.filters}>
      <div className={styles['filtersHeaderRow']}>
        <h2 className={styles.filtersHeader}>
          Фильтры
          <span
            className={`${styles.filtersCounter} ${
              hasActiveFilters ? styles['filtersCounterVisible'] : ''
            }`}
          >
            {` (${activeFiltersCount})`}
          </span>
        </h2>

        <button
          type='button'
          className={`${styles['filtersResetBtn']} ${
            hasActiveFilters ? styles['filtersResetBtnVisible'] : ''
          }`}
          onClick={handleResetFilters}
          aria-hidden={!hasActiveFilters}
          tabIndex={hasActiveFilters ? 0 : -1}
        >
          Сбросить
          <SvgCross className={styles['filtersResetIcon']} />
        </button>
      </div>

      <div className={styles.filtersContent}>
        {/* Тип навыка */}
        <section className={styles.filtersSection}>
          {skillVariants.map((option) => (
            <RadioButton
              key={option.value}
              value={option.value}
              label={option.label}
              checked={value.skillType === option.value}
              onChange={(v) => onChange({ ...value, skillType: v as SkillType })}
            />
          ))}
        </section>

        {/* Навыки */}
        <section className={styles.filtersSection}>
          <h3 className={styles.filtersSubheader}>Навыки</h3>

          <FilterTree
            resetKey={resetCounter}
            categoryUrl='/db/category.json'
            subcategoriesUrl='/db/subcategories.json'
            maxVisible={6}
            showAllText='Все категории'
            collapseText='Скрыть'
            onSelectionChange={(selected: SelectedItem[]) => {
              onChange({ ...value, selectedSkills: selected });
            }}
          />
        </section>

        {/* Пол */}
        <section className={styles.filtersSection}>
          <h3 className={styles.filtersSubheader}>Пол автора</h3>

          {genderVariants.map((option) => (
            <RadioButton
              key={option.value}
              value={option.value}
              label={option.label}
              checked={value.gender === option.value}
              onChange={(v) => onChange({ ...value, gender: v as Gender })}
            />
          ))}
        </section>

        {/* Города */}
        <section className={styles.filtersSection}>
          <h3 className={styles.filtersSubheader}>Город</h3>

          <FilterTree
            resetKey={resetCounter}
            url='/db/city.json'
            maxVisible={5}
            showAllText='Все города'
            collapseText='Скрыть'
            onSelectionChange={(selected: SelectedItem[]) => {
              onChange({ ...value, selectedCities: selected });
            }}
          />
        </section>
      </div>
    </aside>
  );
}

export default FiltersPanel;
