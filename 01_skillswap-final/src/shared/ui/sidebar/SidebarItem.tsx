import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SidebarItem.module.scss';

export interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  to?: string;
  onClick?: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  to,
  onClick,
  isActive = false,
  isDisabled = false,
}) => {
  const content = (
    <div
      className={`${styles.item} ${isActive ? styles.active : ''} ${isDisabled ? styles.disabled : ''}`}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{label}</span>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className={styles.link}>
        {content}
      </Link>
    );
  }

  return (
    <button className={styles.button} onClick={onClick} disabled={isDisabled} aria-label={label}>
      {content}
    </button>
  );
};

export default SidebarItem;
