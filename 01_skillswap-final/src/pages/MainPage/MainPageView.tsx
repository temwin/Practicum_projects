import type React from 'react';
import { Header } from '../../widgets/Header';
import Footer from '../../widgets/Footer';
import FiltersPanel from '../../widgets/FiltersPanel';
import UsersList from '../../widgets/UsersList';
import styles from './MainPageView.module.scss';
import type { User } from '../../api/types';
import type { FiltersValue } from './types';
import { useNavigate } from 'react-router-dom';

export type UserCardProps = {
  isLiked?: boolean;
  likesCount?: number;
  onLikeClick?: () => void;
  onDetailClick?: () => void;
};

type UsersListUser = User & {
  isLiked?: boolean;
  likesCount?: number;
};

interface MainPageViewProps {
  // для CardsList 
  popularUsers: UsersListUser[];
  newUsers: UsersListUser[];
  recommendedUsers: UsersListUser[];

  //для Header
  isAuth?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  // состояния страницы
  isLoading?: boolean;
  error?: string;

  isMatchMode: boolean;
  matchUsers: UsersListUser[];

  filters: FiltersValue;
  onFiltersChange: (v: FiltersValue) => void;

  onLikeClick?: (userId: number) => void;

  //для пагинации
  containerRef: React.RefObject<HTMLDivElement | null>;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;

  showAllPopular: boolean;
  onShowAllPopular: () => void;
  allPopularUsers: UsersListUser[];
  
  showAllNew: boolean;
  onShowAllNew: () => void;
  allNewUsers: UsersListUser[];
}

export const MainPageView: React.FC<MainPageViewProps> = ({
  popularUsers = [],
  newUsers = [],
  recommendedUsers = [],

  isAuth = false,
  searchValue = '',
  onSearchChange,

  isLoading = false,
  error,

  isMatchMode,
  matchUsers,
  filters,
  onFiltersChange,
  onLikeClick,
  containerRef,
  loadMoreRef,

  showAllPopular,
  onShowAllPopular,
  allPopularUsers,
  
  showAllNew,
  onShowAllNew,
  allNewUsers,
}) => {
  const navigate = useNavigate();
  const handleUserClick = (userId: number) => {
    navigate(`/skill/${userId}`);
  };
  
  return (
    <div className={styles.page}>
      <Header isAuth={isAuth} searchValue={searchValue} onSearchChange={onSearchChange} />
      <div className={styles.mainContainer} ref={containerRef}>
        <aside className={styles.sidebar}>
          <FiltersPanel value={filters} onChange={onFiltersChange} />
        </aside>

        <div className={styles.usersListContainer}>
          {isLoading && <div>Загрузка...</div>}
          {error && <div>{error}</div>}

          {isMatchMode ? (
            <div className={styles.usersList}>
              <UsersList
                title='Подходящие предложения'
                mode='all'
                users={matchUsers}
                onLikeClick={onLikeClick}
                onUserClick={handleUserClick}
              />
            </div>
          ) : (
            <>
              <div className={styles.usersList}>
                <UsersList
                  title='Популярное'
                  mode='popular'
                  users={popularUsers}
                  onLikeClick={onLikeClick}
                  onUserClick={handleUserClick}
                  showAll={showAllPopular}
                  onShowAll={onShowAllPopular}
                  hasMore={!showAllPopular && allPopularUsers.length > 3}
                  allUsers={allPopularUsers}
                />
              </div>

              <div className={styles.usersList}>
                <UsersList
                  title='Новое'
                  mode='created'
                  users={newUsers}
                  onLikeClick={onLikeClick}
                  onUserClick={handleUserClick}
                  showAll={showAllNew}
                  onShowAll={onShowAllNew}
                  hasMore={!showAllNew && allNewUsers.length > 3}
                  allUsers={allNewUsers}
                />
              </div>

              <div className={styles.usersList}>
                <UsersList
                  title='Рекомендуем'
                  mode='recommended'
                  users={recommendedUsers}
                  onLikeClick={onLikeClick}
                  onUserClick={handleUserClick}
                />
              </div>
            </>
          )}
          <div ref={loadMoreRef} style={{ height: 1 }} />
        </div>
      </div>

      <Footer />
    </div>
  );
};