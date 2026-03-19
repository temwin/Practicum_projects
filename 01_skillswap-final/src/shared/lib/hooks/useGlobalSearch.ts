import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useGlobalSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Читаем значение поиска из URL
  const urlSearchValue = searchParams.get('q') || '';
  const [searchValue, setSearchValue] = useState(urlSearchValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Синхронизируем с URL
  useEffect(() => {
    setSearchValue(urlSearchValue);
  }, [urlSearchValue]);

  const updateSearchInUrl = useCallback(
    (value: string) => {
      const newParams = new URLSearchParams(searchParams);

      if (value.trim()) {
        newParams.set('q', value.trim());
      } else {
        newParams.delete('q');
      }

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);

      // Отменяем предыдущий таймаут
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Создаем новый таймаут
      timeoutRef.current = setTimeout(() => {
        updateSearchInUrl(value);
      }, 300);
    },
    [updateSearchInUrl]
  );

  const handleSearchSubmit = useCallback(
    (value: string) => {
      // Отменяем таймаут если есть
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setSearchValue(value);
      updateSearchInUrl(value);
    },
    [updateSearchInUrl]
  );

  const clearSearch = useCallback(() => {
    // Отменяем таймаут если есть
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setSearchValue('');
    updateSearchInUrl('');
  }, [updateSearchInUrl]);

  // Очищаем таймаут при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    searchValue,
    setSearchValue,
    handleSearchChange,
    handleSearchSubmit,
    clearSearch,
  };
};
