import { useMemo } from 'react';
import { Button } from '../../shared/ui/button';
import { Icon } from '../../shared/ui/icons';
import ImageSlider from '../../shared/ui/ImageSlider/ImageSlider';
import styles from './SkillDescription.module.scss';

export interface SkillType {
  name: string;
  id: number;
  description: string;
  category: string;
  subcategory: string;
  images?: string[];
  userId: number;
}

export interface SkillDescriptionProps {
  skill: SkillType;
  isLiked: boolean;
  onLike: (skillId: number) => void;
  onShare: (skillId: number) => void;
  onMoreDetails: (skillId: number) => void;
  onMoreOptions?: (skillId: number) => void;
  isOwner?: boolean;
  requestSent?: boolean;
}

function SkillDescription({
  skill,
  isLiked,
  onLike,
  onShare,
  onMoreDetails,
  onMoreOptions,
  isOwner = false,
  requestSent = false,
}: SkillDescriptionProps) {
  const imageUrls = useMemo(() => skill.images || [], [skill.images]);

  const handleExchangeClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Нельзя предложить обмен самому себе
    if (isOwner) return;

    if (requestSent) return;

    onMoreDetails(skill.id);
  };

  return (
    <div className={styles.skillCard}>
      <div className={styles.buttonBlock}>
        <button
          type='button'
          className={styles.likeButton}
          onClick={() => onLike(skill.id)}
          aria-label={isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          <Icon name='like' className={`${isLiked ? styles.iconActive : ''}`} isFilled={isLiked} />
        </button>

        <button
          type='button'
          className={styles.shareButton}
          onClick={() => onShare(skill.id)}
          aria-label='Поделиться навыком'
        >
          <Icon name='share' />
        </button>

        <button
          type='button'
          className={styles.moreButton}
          onClick={() => onMoreOptions?.(skill.id)}
          aria-label='Дополнительные опции'
        >
          <Icon name='moreSquare' />
        </button>
      </div>

      <div className={styles.descriptionBlock}>
        <div className={styles.descriptionWrapper}>
          <div className={styles.skillDescription}>
            <h2 className={styles.skillName}>{skill.name}</h2>

            <div className={styles.metaInfo}>
              <span className={styles.category}>{skill.category}</span>
              <span className={styles.divider}> / </span>
              <span className={styles.subcategory}>{skill.subcategory}</span>
            </div>

            <p className={styles.description}>{skill.description}</p>
          </div>

          <div className={styles.buttonContainer}>
            <Button
              type='button'
              onClick={handleExchangeClick}
              disabled={requestSent && !isOwner}
              variant={requestSent ? 'secondary' : 'primary'}
              hasIcon={requestSent}
              iconPosition='left'
              iconName='clock'
              size='full'
              className={styles.exchangeButton}
            >
              {isOwner ? 'Предложить обмен' : requestSent ? 'Обмен предложен' : 'Предложить обмен'}
            </Button>
          </div>
        </div>

        {imageUrls.length > 0 && <ImageSlider images={imageUrls} />}
      </div>
    </div>
  );
}

export default SkillDescription;
