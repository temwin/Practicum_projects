import React from 'react';
import { Header } from '../../widgets/Header';
import { Profile } from '../../widgets/Profile';
import { Footer } from '../../widgets/Footer';
import type { User } from '../../api/types';
import styles from './ProfilePageUI.module.scss';

export interface ProfilePageUIProps {
  headerOnSearchChange: (value: string) => void;
  headerOnCompactActionClick: () => void;
  headerOnLogout: () => void;
  onSaveProfile?: (updatedUser: Partial<User> & { newPassword?: string }) => void;
  userData: User | null;
  isLoading?: boolean;
  error?: string | null;
}

export const ProfilePageUI: React.FC<ProfilePageUIProps> = ({
  headerOnSearchChange,
  headerOnLogout,
  onSaveProfile,
  userData,
  isLoading = false,
  error = null,
}) => {
  return (
    <div className={styles.page}>
      <Header
        isAuth
        searchValue=''
        onSearchChange={headerOnSearchChange}
        onLogout={headerOnLogout}
      />

      <div className={styles.mainContainer}>
        {isLoading ? (
          <div
            style={{
              width: '100%',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Загрузка профиля...
          </div>
        ) : error ? (
          <div style={{ width: '100%', padding: '40px', textAlign: 'center', color: 'red' }}>
            Ошибка: {error}
          </div>
        ) : (
          <Profile userData={userData} onSaveProfile={onSaveProfile}/>
        )}
      </div>

      <Footer />
    </div>
  );
};
