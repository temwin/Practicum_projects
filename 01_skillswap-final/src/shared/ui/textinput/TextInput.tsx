import React, { useState } from 'react';
import { Icon } from '../icons';
import styles from './TextInput.module.scss';

export interface TextInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: 'text' | 'password';
  hint?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  hint,
  error,
  disabled = false,
  className = '',
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === 'password';
  const displayType = isPassword && isPasswordVisible ? 'text' : type;

  const togglePasswordVisibility = () => {
    if (!disabled) {
      setIsPasswordVisible((prev) => !prev);
    }
  };

  const hasError = !!error;
  const helperText = hasError ? error : hint;

  return (
    <div className={`${styles.textInput} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.inputWrapper} ${hasError ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
      >
        <input
          type={displayType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
        />
        {isPassword && (
          <button
            type='button'
            className={styles.toggleButton}
            onClick={togglePasswordVisibility}
            aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
            disabled={disabled}
          >
            <Icon name={isPasswordVisible ? 'eyeSlash' : 'eye'} />
          </button>
        )}
      </div>
      {helperText && (
        <span className={`${styles.helperText} ${hasError ? styles.errorText : ''}`}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export { TextInput };
export default TextInput;
