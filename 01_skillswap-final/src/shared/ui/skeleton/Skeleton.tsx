import React from 'react';
import styles from './Skeleton.module.scss';

export type SkeletonVariant = 'cards'; // сюда добавим 'text', 'profile' и т.д. позже

export interface SkeletonProps {
  rows?: number;
  variant?: SkeletonVariant;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ rows = 1, variant = 'cards', className = '' }) => {
  if (variant === 'cards') {
    return (
      <div className={`${styles.skeletonContainer} ${className}`}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {Array.from({ length: 3 }).map((_, colIndex) => (
              <div key={colIndex} className={styles.card}>
                <div className={styles.header}>
                  <div className={styles.avatar} />
                  <div className={styles.headerData}>
                    <div className={styles.name} />
                    <div className={styles.cityAge} />
                  </div>
                </div>
                <div className={styles.sectionLabel}>Может научить:</div>
                <div className={styles.tags}>
                  <div className={styles.tag} />
                </div>
                <div className={styles.sectionLabel}>Хочет научиться:</div>
                <div className={styles.tags}>
                  <div className={styles.tag} />
                  <div className={styles.tag} />
                </div>
                <div className={styles.button} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export { Skeleton };
export default Skeleton;
