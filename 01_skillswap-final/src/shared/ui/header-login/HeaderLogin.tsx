import React from 'react';
import { Logo } from '../logo';
import { Icon } from '../icons';
import styles from './HeaderLogin.module.css';

export interface HeaderLoginProps {
  onLogoClick?: () => void;
  onClose?: () => void;
  className?: string;
}

export const HeaderLogin: React.FC<HeaderLoginProps> = ({ onLogoClick, onClose, className }) => {
  return (
    <header className={`${styles.header} ${className || ''}`}>
      <div className={styles.left}>
        <div
          role='button'
          tabIndex={0}
          onClick={onLogoClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onLogoClick?.();
          }}
          aria-label='На главную'
        >
          <Logo />
        </div>
      </div>

      <div className={styles.right}>
        <div
          className={styles.closeBtn}
          onClick={onClose}
          role='button'
          tabIndex={0}
          aria-label='Закрыть'
        >
          <span className={styles.closeText}>Закрыть</span>
          <Icon name='cross' />
        </div>
      </div>
    </header>
  );
};
