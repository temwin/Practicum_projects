import React, { useRef } from 'react';
import { Icon } from '../icons';
import styles from './Search.module.scss';

export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Search: React.FC<SearchProps> = ({
  value,
  onChange,
  placeholder = 'Искать навык',
  className = '',
  onKeyDown,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`${styles.search} ${className}`}>
      <Icon name='search' className={styles.searchIcon} />
      <input
        ref={inputRef}
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={styles.input}
      />
      {value && (
        <button
          type='button'
          className={styles.clearButton}
          onClick={handleClear}
          aria-label='Очистить поиск'
        >
          <Icon name='cross' className={styles.clearIcon} />
        </button>
      )}
    </div>
  );
};

export default Search;
