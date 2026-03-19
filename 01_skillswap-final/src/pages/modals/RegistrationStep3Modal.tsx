import React, { useEffect } from 'react';
import { Text } from '../../shared/ui/text';
import SkillConfirmation from '../../shared/ui/skillConfirmation/SkillConfirmation';
import type { SkillType } from '../../widgets/SkillDescription/SkillDescription';
import styles from './RegistrationStep3Modal.module.css';

interface RegistrationStep3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onEdit: () => void;
  skill: SkillType;
}

export const RegistrationStep3Modal: React.FC<RegistrationStep3ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onEdit,
  skill,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Если isOpen=false, не рендерим ничего
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          {/* Заголовок */}
          <div className={styles.topTexts}>
            <Text variant='h3' className={styles.mainText}>
              Ваше предложение
            </Text>
            <Text variant='body' className={styles.subText}>
              Пожалуйста, проверьте и подтвердите правильность данных
            </Text>
          </div>

          <div className={styles.divider}></div>

          {/* Карточка навыка с кнопками "Редактировать" и "Готово" внутри */}
          <SkillConfirmation
            skill={skill}
            onEdit={onEdit}
            onConfirm={onConfirm}
            isOwner={false}
            requestSent={false}
          />
        </div>
      </div>
    </div>
  );
};
