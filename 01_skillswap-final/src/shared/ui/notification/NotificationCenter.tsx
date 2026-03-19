import React, { useEffect, useState } from 'react';
import { Notification, type NotificationProps } from './Notification';
import styles from './NotificationCenter.module.scss';

export interface NotificationCenterProps {
  notifications: Omit<NotificationProps, 'onDismiss'>[];
  className?: string;
  itemClassName?: string;
  dismissible?: boolean;

  variant?: 'toast' | 'inline';
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  className = '',
  itemClassName = '',
  dismissible = true,
  variant = 'toast',
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState(notifications);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  const handleDismiss = (idToRemove: string) => {
    setVisibleNotifications((prev) => prev.filter((n) => n.id !== idToRemove));
  };

  const rootClass = variant === 'inline' ? styles.centerInline : styles.centerToast;

  return (
    <div className={`${rootClass} ${className}`}>
      {visibleNotifications.map((notif) => (
        <Notification
          key={notif.id}
          {...notif}
          variant={variant}
          className={`${styles.fadeIn} ${itemClassName}`}
          onDismiss={dismissible ? () => handleDismiss(notif.id!) : undefined}
        />
      ))}
    </div>
  );
};

export default NotificationCenter;
