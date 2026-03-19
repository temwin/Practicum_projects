import React from 'react';
import styles from './Sidebar.module.scss';

export interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ children, className }) => {
  return (
    <aside className={`${styles.sidebar} ${className}`}>
      <nav className={styles.nav}>{children}</nav>
    </aside>
  );
};

export default Sidebar;
