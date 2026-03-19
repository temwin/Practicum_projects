import React from 'react';
import { Icon } from '../icons';
import styles from './Checkbox.module.scss';

export type CheckboxState = 'empty' | 'checked' | 'indeterminate';

export interface CheckboxProps {
  state: CheckboxState;
  onChange: (newState: CheckboxState) => void;
  label?: string;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
  className?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  state,
  onChange,
  label,
  onToggleExpand,
  isExpanded,
  className = '',
  disabled = false,
}) => {
  const handleCheckboxClick = () => {
    if (disabled) return;
    if (state === 'empty') {
      onChange('checked');
    } else if (state === 'checked') {
      onChange('empty');
    } else if (state === 'indeterminate') {
      onChange('checked');
    }
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleExpand) {
      onToggleExpand();
    }
  };

  const checkboxIconName =
    state === 'empty' ? 'checkboxEmpty' : state === 'checked' ? 'checkboxDone' : 'checkboxRemove';

  const iconColor = state === 'empty' ? 'var(--color-text)' : 'var(--color-accent)';

  const chevronIcon = isExpanded ? 'chevronUp' : 'chevronDown';

  return (
    <div className={`${styles.checkbox} ${className}`}>
      <span className={styles.inputWrapper} onClick={handleCheckboxClick}>
        <Icon
          name={checkboxIconName}
          style={{ color: iconColor }}
          className={styles.icon}
          aria-hidden='true'
        />
      </span>
      {label && (
        <div className={styles.labelContainer}>
          <span className={styles.labelText} onClick={handleCheckboxClick}>
            {label}
          </span>
          {onToggleExpand && (
            <button
              type='button'
              className={styles.chevronButton}
              onClick={handleChevronClick}
              aria-label={isExpanded ? 'Свернуть' : 'Развернуть'}
            >
              <Icon name={chevronIcon} className={styles.chevronIcon} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export { Checkbox };
export default Checkbox;
