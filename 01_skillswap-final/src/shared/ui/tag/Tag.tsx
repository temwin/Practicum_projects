import React from 'react';
import styles from './Tag.module.scss';

export type TagType = 'business' | 'creation' | 'langs' | 'education' | 'home' | 'health' | 'plus';

export interface TagProps {
  type: TagType;
  children: string;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ type, children, className = '' }) => {
  return (
    <div className={`${styles.tag} ${styles[`type-${type}`]} ${className}`} data-type={type}>
      <span>
        {children}
      </span>
    </div>
  );
};

export { Tag };
export default Tag;
