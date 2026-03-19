import React from 'react';
import { Header } from '../../widgets/Header';
import { Footer } from '../../widgets/Footer';
import ErrorPageComponent from '../../widgets/ErrorPage/ErrorPage';
import styles from './Error404Page.module.css';

export type ErrorType = 404 | 500;

export interface Error404PageUIProps {
  errorType: ErrorType;
  showHeader?: boolean;
  showFooter?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onLogoClick?: () => void;
  onClose?: () => void;
  onRetry?: () => void;
}

export const Error404PageUI: React.FC<Error404PageUIProps> = ({
  errorType,
  showHeader = true,
  showFooter = true,
  searchValue = '',
  onSearchChange,
  onRetry,
}) => {
  return (
    <div className={styles.page}>
      {showHeader && (
        <Header
          isAuth={false}
          showSearch={true}
          showMenu={true}
          pushToLeft={true}
          compactActions={false}
          searchValue={searchValue}
          onSearchChange={onSearchChange || (() => {})}
        />
      )}

      <div className={styles.contentWrapper}>
        <div className={styles.errorContainer}>
          <ErrorPageComponent errorType={errorType} onRetry={onRetry} />
        </div>
      </div>

      {showFooter && <Footer />}
    </div>
  );
};
