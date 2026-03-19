import React, { useState, useMemo } from 'react';
import { Error404PageUI, type ErrorType } from './ErrorPage/Error404PageUI';

const Error404Page = () => {
  const [searchValue, setSearchValue] = useState('');

  // Определяем тип ошибки на основе URL без использования useEffect
  const errorType = useMemo<ErrorType>(() => {
    const path = window.location.pathname;
    return path.includes('500') ? 500 : 404;
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleRetry = () => {
    alert('Форма обратной связи будет здесь');
  };

  return (
    <Error404PageUI
      errorType={errorType}
      showHeader={true}
      showFooter={true}
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      onRetry={handleRetry}
    />
  );
};

export default Error404Page;
