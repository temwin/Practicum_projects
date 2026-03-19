import React from 'react';
import UsersList from '../../UsersList';
import type { User } from '../../../api/types';
import { Button } from '../../../shared/ui/button';
import styles from './UserFavorites.module.scss';

interface UserFavoritesProps {
  users: User[];
  onRemove: (id: number) => void;
  onUserClick: (id: number) => void;
}

const UserFavorites: React.FC<UserFavoritesProps> = ({ users, onRemove, onUserClick }) => {
  if (users.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <p>
          Вы пока не добавили ни одного пользователя в Избранное. Перейдите в каталог навыков, чтобы
          отметить понравившиеся навыки.
        </p>
        <div style={{ width: '200px' }}>
          <Button variant='primary' size='full' onClick={() => (window.location.href = '/')}>
            Перейти в каталог
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.favorites}>
      <div className={styles.favoritesListContainer}>
        <UsersList
          title='Избранное'
          mode='recommended'
          users={users}
          onLikeClick={onRemove}
          onUserClick={onUserClick}
        />
      </div>
    </div>
  );
};

export default UserFavorites;
