import React, { useEffect } from 'react';
import styles from './SuccessModal.module.css';
import { Button } from '../../../shared/ui/button';
import Avatar from '../../../shared/ui/avatar/Avatar';
import avatarPlaceholder from '/src/shared/assets/user-circle.png';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  avatarUrl?: string;
  userName?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  avatarUrl,
  userName,
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

  if (!isOpen) return null;

  const handleDoneClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onConfirm();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.avatarContainer}>
          <Avatar
            src={avatarUrl}
            fallbackSrc={avatarPlaceholder}
            alt={userName || 'Пользователь'}
            className={styles.avatar}
            loading='lazy'
            decoding='async'
          />
        </div>

        <div className={styles.textContainer}>
          <h2 className={styles.mainText}>Ваше предложение создано</h2>
          <p className={styles.subText}>Теперь вы можете предложить обмен</p>
        </div>

        <div className={styles.buttonContainer}>
          <Button
            type='button'
            className={styles.doneButton}
            variant='primary'
            onClick={handleDoneClick}
            size='full'
          >
            Готово
          </Button>
        </div>
      </div>
    </div>
  );
};
