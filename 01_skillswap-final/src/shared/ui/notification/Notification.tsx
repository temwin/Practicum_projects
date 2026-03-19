import React, { useState } from 'react';
import { Icon, type IconName } from '../icons';
import styles from './Notification.module.scss';
import { Button } from '../button';
import { Text } from '../text';

export interface NotificationProps {
  id?: string;
  icon?: IconName;
  text: string;
  onDismiss?: () => void;
  onGoTo?: () => void;
  className?: string;
  variant?: 'toast' | 'inline';
}

const Notification: React.FC<NotificationProps> = ({
  icon,
  text,
  onDismiss,
  onGoTo,
  className = '',
  variant = 'toast',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (variant === 'toast') {
    return (
      <div
        className={`${styles.notification} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {icon && <Icon name={icon} className={styles.icon} />}
        <Text variant='h3'>{text}</Text>
        {onGoTo && isHovered && (
          <button type='button' className={styles.gotoButton} onClick={onGoTo}>
            Перейти
          </button>
        )}
        {onDismiss && (
          <Icon
            name='cross'
            className={styles.closeButton}
            onClick={onDismiss}
            aria-label='Закрыть уведомление'
          />
        )}
      </div>
    );
  } else {
    return (
      <div
        className={`${styles.notificationInline} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.messageWrapper}>
          {icon && <Icon name='idea' className={styles.iconInline} />}
          <div className={styles.textWrapper}>
            <Text variant='body'>{text}</Text>
            <Text variant='caption'>Перейдите в профиль, чтобы обсудить детали</Text>
          </div>
        </div>
        {onGoTo && (
          <Button variant='primary' size='content' onClick={onGoTo}>
            Перейти
          </Button>
        )}
      </div>
    );
  }
};

export { Notification };
export default Notification;
