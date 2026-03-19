import React, { useState, useEffect, useCallback, useRef } from 'react';
import Search from './Search';

export interface GlobalSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  onEnter?: (value: string) => void;
}

// Тип для debounced функции с методом cancel
type DebouncedFunction = ((value: string) => void) & { cancel: () => void };

// Фабрика debounced функций
function createDebouncedFunction(func: (value: string) => void, wait: number): DebouncedFunction {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (value: string): void => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(value);
    }, wait);
  };

  // Метод для отмены
  debounced.cancel = (): void => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  value: propValue,
  onChange,
  placeholder = 'Искать навык',
  debounceMs = 300,
  onEnter,
}) => {
  const [localValue, setLocalValue] = useState(propValue);
  const debouncedOnChangeRef = useRef<DebouncedFunction | null>(null);

  // Обновляем локальное значение при изменении пропса
  useEffect(() => {
    setLocalValue(propValue);
  }, [propValue]);

  // Создаем debounced функцию
  useEffect(() => {
    debouncedOnChangeRef.current = createDebouncedFunction(onChange, debounceMs);

    return () => {
      if (debouncedOnChangeRef.current) {
        debouncedOnChangeRef.current.cancel();
      }
    };
  }, [onChange, debounceMs]);

  const handleChange = useCallback((newValue: string) => {
    setLocalValue(newValue);

    if (debouncedOnChangeRef.current) {
      debouncedOnChangeRef.current(newValue);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onEnter) {
        e.preventDefault();

        // Отменяем отложенный вызов
        if (debouncedOnChangeRef.current) {
          debouncedOnChangeRef.current.cancel();
        }

        onEnter(localValue);
      }
    },
    [localValue, onEnter]
  );

  return (
    <Search
      value={localValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
    />
  );
};
