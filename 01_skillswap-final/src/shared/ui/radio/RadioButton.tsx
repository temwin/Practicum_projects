import React from 'react';
import { Icon } from '../icons';
import styles from './RadioButton.module.scss';

export interface RadioButtonProps {
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(value);
    }
  };

  const iconName = checked ? 'radiobuttonActive' : 'radiobuttonEmpty';
  const iconColor = checked ? 'var(--color-text-link)' : 'var(--color-text)';

  return (
    <label
      className={`${styles.radioButton} ${disabled ? styles.disabled : ''} ${className}`}
      onClick={handleClick}
    >
      <span className={styles.inputWrapper}>
        <Icon name={iconName} style={{ color: iconColor }} className={styles.icon} />
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
};

export { RadioButton };
export default RadioButton;
