import { useEffect, useState, type JSX } from 'react';
import { CardSkill } from '../CardSkill/CardSkill';
import styles from './UsersList.module.scss';
import { Button } from '../../shared/ui/button/';
import { Icon } from '../../shared/ui/icons';
import type { User } from '../../api/types';
import { useAppSelector } from '../../app/providers/store';
import { selectCurrentUser } from '../../entities/user/model/selectors';

type Mode = 'all' | 'likes' | 'popular' | 'created' | 'recommended';

type CardUser = User & {
  isLiked?: boolean;
  likesCount?: number;
};

interface Props {
  title: string;
  mode: Mode;
  users: CardUser[];
  onUserClick?: (userId: number) => void;
  onLikeClick?: (userId: number) => void;
  showAll?: boolean;
  onShowAll?: () => void;
  hasMore?: boolean;
  allUsers?: CardUser[];
}

export default function UsersList({
  title,
  mode,
  users,
  onUserClick,
  onLikeClick,
  showAll = false,
  onShowAll,
  hasMore = false,
  allUsers,
}: Props): JSX.Element {
  const authUser = useAppSelector(selectCurrentUser);

  const config = {
    all: {
      actionLabel: 'Сначала новые',
      limit: 3,
      showButton: true,
    },
    likes: {
      actionLabel: undefined,
      limit: 4,
      showButton: false,
    },
    popular: {
      actionLabel: 'Смотреть все',
      limit: 3,
      showButton: true,
    },
    created: {
      actionLabel: 'Смотреть все',
      limit: 3,
      showButton: true,
    },
    recommended: {
      actionLabel: undefined,
      limit: 0,
      showButton: false,
    },
  } as const;

  const { actionLabel, limit, showButton } = config[mode];

  const [currentPosition, setCurrentPosition] = useState(0);

  const isMatchSection = title.trim().toLowerCase() === 'подходящие предложения';

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPosition(0);
    }, 0);

    return () => clearTimeout(timer);
  }, [mode, users.length]);

  const isCarouselMode = mode === 'likes' && !isMatchSection;

  const isRecommendedMode = mode === 'recommended';

  // Функция для подготовки пользователя для CardSkill
  const prepareUserForCardSkill = (user: CardUser) => {
    // Создаем дефолтные значения для обязательных полей
    const defaultSkill = {
      id: 0,
      name: 'Навык не указан',
      subcategoryId: 0,
      description: '',
    };

    const defaultLocation = { id: 0, name: 'Не указано' };

    // Преобразуем location
    let locationData = defaultLocation;
    if (user.location) {
      if (typeof user.location === 'object' && 'id' in user.location && 'name' in user.location) {
        locationData = user.location as { id: number; name: string };
      } else if (typeof user.location === 'string') {
        locationData = { id: 0, name: user.location };
      } else if (typeof user.location === 'number') {
        locationData = { id: user.location, name: `Город ${user.location}` };
      }
    }

    return {
      ...user,
      skillCanTeach: user.skillCanTeach || defaultSkill,
      location: locationData,
      subcategoriesWantToLearn: user.subcategoriesWantToLearn || [],
    };
  };

  const getVisibleUsers = () => {
    let visibleUsers: CardUser[] = [];

    // Если включен режим "показать все" для популярных или новых пользователей
    if ((mode === 'popular' || mode === 'created') && showAll && allUsers) {
      visibleUsers = allUsers;
    } else if (isMatchSection) {
      visibleUsers = users;
    } else if (isRecommendedMode) {
      visibleUsers = users;
    } else if (!isCarouselMode || users.length <= limit) {
      visibleUsers = users.slice(0, limit);
    } else {
      const visible: CardUser[] = [];
      for (let i = 0; i < limit; i++) {
        const index = (currentPosition + i) % users.length;
        visible.push(users[index]);
      }
      visibleUsers = visible;
    }

    return visibleUsers.map(prepareUserForCardSkill);
  };

  const visibleUsers = getVisibleUsers();

  const handleNext = () => {
    if (isCarouselMode && users.length > limit) {
      setCurrentPosition((prev) => (prev + 1) % users.length);
    }
  };

  const handlePrev = () => {
    if (isCarouselMode && users.length > limit) {
      setCurrentPosition((prev) => (prev - 1 + users.length) % users.length);
    }
  };

  const shouldShowNavigation = isCarouselMode && users.length > limit;
  const isFirstCardActive = currentPosition === 0;
  const isLastCardActive =
    (currentPosition + limit) % users.length === 0 || currentPosition + limit >= users.length;

  const handleActionClick = () => {
    // Если это кнопка "Смотреть все" в секции популярных или новых, вызываем onShowAll
    if ((mode === 'popular' || mode === 'created') && onShowAll) {
      onShowAll();
    }

  };

  const isSortMode = mode === 'all';

  // Определяем, показывать ли кнопку действия
  const showActionButton = () => {
    // Для популярных и новых: показываем только если есть еще пользователи и не включен режим "показать все"
    if (mode === 'popular' || mode === 'created') {
      return hasMore && !showAll && actionLabel;
    }
    
    // Для остальных режимов используем config для определения, показывать ли кнопку
    return showButton && actionLabel && !isMatchSection;
  };

  const handleCardClick = (userId: number) => {
    onUserClick?.(userId);
  };

  const handleLikeClick = (userId: number) => {
    onLikeClick?.(userId);
  };

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          {title}
          {isSortMode && `: ${visibleUsers.length}`}
        </h2>

        <div className={styles.actionsWrapper}>
          {showActionButton() && (
            <div className={styles.actionWrapper}>
              <Button
                variant='tertiary'
                onClick={handleActionClick}
                hasIcon
                iconName={isSortMode ? 'sort' : 'chevronRight'}
                iconPosition={isSortMode ? 'left' : 'right'}
                className={styles.hideTextMobile}
              >
                {actionLabel}
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className={styles.cardsGrid}>
        {visibleUsers.map((user, index) => (
          <div key={user.id} className={styles.cardWrapper} style={{ position: 'relative' }}>
            <CardSkill
              userId={user.id}
              user={user}
              variant='compact'
              isLiked={authUser?.likedUserIds?.includes(user.id) ?? false}
              likesCount={user.likesCount ?? user.liked}
              onDetailClick={() => handleCardClick(user.id)}
              onLikeClick={() => handleLikeClick(user.id)}
            />

            {shouldShowNavigation && index === 0 && !isFirstCardActive && (
              <button
                className={`${styles.navButton} ${styles.navButtonLeft}`}
                onClick={handlePrev}
                aria-label='Предыдущие карточки'
              >
                <Icon name='chevronRight' style={{ transform: 'rotate(180deg)' }} />
              </button>
            )}

            {shouldShowNavigation && index === limit - 1 && !isLastCardActive && (
              <button
                className={`${styles.navButton} ${styles.navButtonRight}`}
                onClick={handleNext}
                aria-label='Следующие карточки'
              >
                <Icon name='chevronRight' />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}