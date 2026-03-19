import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Icon, type IconName } from '../../shared/ui/icons';
import styles from './Profile.module.scss';
import clsx from 'clsx';
import type { User } from '../../api/types';

interface MenuItem {
  id: string;
  label: string;
  icon: IconName;
  path: string;
}

const menuItems: MenuItem[] = [
  { id: 'requests', label: 'Заявки', icon: 'request', path: 'requests' },
  { id: 'exchanges', label: 'Мои обмены', icon: 'messageText', path: 'exchanges' },
  { id: 'favorites', label: 'Избранное', icon: 'like', path: 'favorites' },
  { id: 'skills', label: 'Мои навыки', icon: 'idea', path: 'skills' },
  { id: 'personal', label: 'Личные данные', icon: 'user', path: 'personal' },
];

interface ProfileProps {
  userData: User | null;
  onSaveProfile?: (updatedUser: Partial<User> & { newPassword?: string }) => void;
}

const Profile: React.FC<ProfileProps> = ({ userData }) => {
  return (
    <div className={styles.profileLayout}>
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {menuItems.map((item) => (
              <li key={item.id} className={styles.navItem}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(styles.navButton, {
                      [styles.active]: isActive,
                    })
                  }
                >
                  <Icon name={item.icon} className={styles.icon} />
                  <span className={styles.label}>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className={styles.content}>
        <Outlet context={userData} />
      </main>
    </div>
  );
};

export default Profile;
export { Profile };
