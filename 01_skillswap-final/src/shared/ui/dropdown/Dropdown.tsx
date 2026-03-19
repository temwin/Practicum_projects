import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../icons';
import styles from './Dropdown.module.scss';
import type { Category, Subcategory, Skill, City, Gender } from './types';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  label?: string;
  options?: DropdownOption[];
  optionsFromJSON?: 'category' | 'subcategory' | 'skill' | 'city' | 'gender';
  optionsFromJSONFilterId?: number;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
  disabled?: boolean;
  error?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options = [],
  optionsFromJSON,
  optionsFromJSONFilterId,
  value,
  onChange,
  onBlur,
  placeholder = 'Выберите значение',
  isSearchable = false,
  className = '',
  disabled = false,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [internalOptions, setInternalOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!optionsFromJSON) {
      setInternalOptions(options);
    }
  }, [options, optionsFromJSON]);

  useEffect(() => {
    if (optionsFromJSON === undefined) return;

    let isCancelled = false;

    const loadOptions = async () => {
      setLoading(true);
      try {
        let url = '';
        switch (optionsFromJSON) {
          case 'category':
            url = '/db/category.json';
            break;
          case 'subcategory':
            url = '/db/subcategories.json';
            break;
          case 'skill':
            url = '/db/skills.json';
            break;
          case 'city':
            url = '/db/city.json';
            break;
          case 'gender':
            url = '/db/genders.json';
            break;
          default:
            setInternalOptions([]);
            return;
        }

        const res = await fetch(url);
        const data = await res.json();

        let filtered: (Category | Subcategory | Skill | City | Gender)[] = [];

        if (optionsFromJSON === 'category') {
          filtered = data as Category[];
        } else if (optionsFromJSON === 'subcategory') {
          const subcategories = data as Subcategory[];
          filtered =
            optionsFromJSONFilterId !== undefined
              ? subcategories.filter((item) => item.categoryId === optionsFromJSONFilterId)
              : [];
        } else if (optionsFromJSON === 'skill') {
          const skills = data as Skill[];
          filtered =
            optionsFromJSONFilterId !== undefined
              ? skills.filter((item) => item.subcategoryId === optionsFromJSONFilterId)
              : [];
        } else if (optionsFromJSON === 'city') {
          filtered = Array.isArray(data) ? data : data.cities || [];
        } else if (optionsFromJSON === 'gender') {
          filtered = Array.isArray(data) ? data : [];
        }

        if (!isCancelled) {
          setInternalOptions(
            filtered.map((item) => ({
              value: String(item.id),
              label: item.name,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to load dropdown options:', err);
        if (!isCancelled) setInternalOptions([]);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    loadOptions().catch((error) => {
      console.error('Unexpected error in loadOptions:', error);
      if (!isCancelled) {
        setInternalOptions([]);
        setLoading(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [optionsFromJSON, optionsFromJSONFilterId]);

  const selectedOption = internalOptions.find((opt) => opt.value === value);
  const filteredOptions = isSearchable
    ? internalOptions.filter((opt) => opt.label.toLowerCase().includes(inputValue.toLowerCase()))
    : internalOptions;

  useEffect(() => {
    if (selectedOption && isSearchable) {
      setInputValue(selectedOption.label);
    } else if (!value && isSearchable) {
      setInputValue('');
    }
  }, [value, selectedOption, isSearchable]);

  const handleSelect = (option: DropdownOption) => {
    onChange?.(option.value);
    setIsOpen(false);
    onBlur?.();
    if (isSearchable) {
      setInputValue(option.label);
    }
  };

  const handleInputClick = () => {
    if (disabled) return;
    if (isOpen) {
      onBlur?.();
    }
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setIsOpen(true);
    if (!val) {
      onChange?.('');
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange?.('');
    setIsOpen(false);
    onBlur?.();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) {
          onBlur?.();
        }
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onBlur]);

  return (
    <div className={`${styles.dropdown} ${className}`} ref={dropdownRef}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.control} ${disabled ? styles.disabled : ''} ${isOpen ? styles.isOpen : ''} ${error ? styles.error : ''}`}
        onClick={handleInputClick}
      >
        {isSearchable ? (
          <input
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={styles.input}
            disabled={disabled}
            readOnly={!isSearchable}
          />
        ) : (
          <div className={styles.display}>
            <span className={!selectedOption ? styles.placeholder : undefined}>
              {selectedOption?.label || placeholder}
            </span>
          </div>
        )}
        <div className={styles.icons}>
          {isSearchable && inputValue && (
            <button
              type='button'
              className={styles.clearButton}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              aria-label='Очистить'
            >
              <Icon name='cross' className={styles.clearIcon} />
            </button>
          )}
          <Icon name={isOpen ? 'chevronUp' : 'chevronDown'} className={styles.arrowIcon} />
        </div>
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
      {isOpen && (
        <div className={`${styles.menu} ${styles.isOpen}`}>
          <div className={styles.options}>
            {loading ? (
              <div className={styles.loading}>Загрузка...</div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className={styles.noResults}>Ничего не найдено</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { Dropdown };
export default Dropdown;
