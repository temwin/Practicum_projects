import { useMemo } from 'react';
import { Button } from '../button';
import ImageSlider from '../ImageSlider/ImageSlider';
import styles from './SkillConfirmation.module.css';
import type { SkillType } from '../../../widgets/SkillDescription/SkillDescription';


export interface SkillConfirmationProps {
  skill: SkillType;
  onEdit: () => void;
  onConfirm: () => void;
  isOwner?: boolean;
  requestSent?: boolean;
}

function SkillConfirmation({
  skill,
  onEdit,
  onConfirm,
  isOwner = false,
  requestSent = false,
}: SkillConfirmationProps) {
  const imageUrls = useMemo(() => skill.images || [], [skill.images]);


  return (
    <div className={styles.skillCard}>
      <div className={styles.contentWrapper}>
        {/* Левый блок: описание */}
        <div className={styles.descriptionBlock}>
          <div className={styles.textBlock}>
            <h2 className={styles.skillName}>{skill.name}</h2>


            <div className={styles.metaInfo}>
              <span className={styles.category}>{skill.category}</span>
              <span className={styles.divider}> / </span>
              <span className={styles.subcategory}>{skill.subcategory}</span>
            </div>

            <p className={styles.description}>{skill.description}</p>
          </div>

          {/* Контейнер кнопок */}
          <div className={styles.buttonGrid}>
            <Button
              onClick={onEdit}
              variant="secondary"
              size="full"
              className={styles.editButton}
            >
              Редактировать
            </Button>

            <Button
              onClick={onConfirm}
              variant="primary"
              size="full"
              className={styles.confirmButton}
              disabled={requestSent && !isOwner}
            >
              Готово
            </Button>
          </div>
        </div>

        {/* Правый блок: слайдер изображений */}
        {imageUrls.length > 0 && (
          <div className={styles.imageSlider}>
            <ImageSlider images={imageUrls} />
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillConfirmation;
