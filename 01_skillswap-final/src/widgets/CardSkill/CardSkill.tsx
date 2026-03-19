import styles from './CardSkill.module.scss';
import type React from 'react';
import { Icon } from '../../shared/ui/icons';
import { Tag } from '../../shared/ui/tag';
import { Button } from '../../shared/ui/button';
import { Text } from '../../shared/ui/text';
import Avatar from '../../shared/ui/avatar/Avatar';
import avatarPlaceholder from '/src/shared/assets/user-circle.png';
import { getFirstName } from '../../shared/helpers/getFirstName';
import { getAgeFromBirthDate } from '../../shared/helpers/getAgeFromBirthData';
import type { UserWithSkill } from '../../pages/SkillPage';
import { useCategoryTag } from '../../shared/lib/hooks/useCategoryTag';
import { useAppSelector } from '../../app/providers/store';

interface CardSkillProps {
  userId?: number;
  user?: UserWithSkill;
  variant?: 'compact' | 'detailed';
  isLiked?: boolean;
  likesCount?: number;
  onLikeClick?: () => void;
  onDetailClick?: () => void;
}

export const CardSkill: React.FC<CardSkillProps> = ({
  userId,
  user: propUser,
  variant = 'compact',
  isLiked = false,
  likesCount,
  onLikeClick,
  onDetailClick,
}) => {
  const currentUser = useAppSelector((state) =>
    userId ? state.users.users.find((u) => u.id === userId) : null
  );

  const user = currentUser || propUser;
  if (!user) return null;
  const isCompact = variant === 'compact';
  const getTagType = useCategoryTag(); // Используем хук

  const cardClass = isCompact
    ? `${styles.card} ${styles.cardCompact}`
    : `${styles.card} ${styles.cardDetailed}`;

  return (
    <div className={cardClass}>
      <div className={styles.cardHeader}>
        <Avatar
          key={user.avatarUrl || user.id}
          src={user.avatarUrl}
          fallbackSrc={avatarPlaceholder}
          alt={user.name}
          className={styles.userAvatar}
          loading='lazy'
          decoding='async'
        />
        <div className={styles.userInfo}>
          {isCompact && onLikeClick && (
            <button
              onClick={onLikeClick}
              type='button'
              className={`${styles.likeButton} ${isLiked ? styles.iconActive : ''}`}
            >
              <Icon
                name='like'
                className={`${isLiked ? styles.iconActive : ''}`}
                isFilled={isLiked}
              />
              <span className={styles.likeCount}>{likesCount}</span>
            </button>
          )}

          <Text variant='h3' children={getFirstName(user.name)} className={styles.userText} />
          <Text
            variant='caption'
            children={`${user.location.name}, ${getAgeFromBirthDate(user.dateOfBirth)}`}
            className={styles.userText}
          />
        </div>
      </div>

      {!isCompact && user.greeting && (
        <Text variant='body' children={user.greeting} className={styles.userDescription} />
      )}

      <div className={styles.userSkillsInfo}>
        <div className={styles.userSkillsInfoSection}>
          <Text variant='h4' className={styles.userText}>
            {isCompact ? 'Может научить:' : 'Может научить'}
          </Text>
          <div className={styles.userSkills}>
            <Tag
              type={getTagType(user.skillCanTeach.category?.id)} // Вызываем функцию
              children={user.skillCanTeach.name}
            />
          </div>
        </div>

        <div className={styles.userSkillsInfoSection}>
          <Text variant='h4' className={styles.userText}>
            {isCompact ? 'Хочет научиться:' : 'Хочет научиться'}
          </Text>
          <div className={styles.userSkills}>
            {user.subcategoriesWantToLearn?.slice(0, 1).map((skill) => (
              <Tag
                key={skill.id}
                type={getTagType(skill.category?.id)} // Вызываем функцию
                children={skill.name}
              />
            ))}
            {user.subcategoriesWantToLearn && user.subcategoriesWantToLearn.length > 1 && (
              <Tag type='plus' children={`+${user.subcategoriesWantToLearn.length - 1}`} />
            )}
          </div>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        {isCompact && onDetailClick && (
          <Button
            onClick={onDetailClick}
            variant={'primary'}
            children='Подробнее'
            size='full'
            className={styles.detailedButton}
          />
        )}
      </div>
    </div>
  );
};
