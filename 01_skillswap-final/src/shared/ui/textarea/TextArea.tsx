import React from 'react';
import styles from './TextArea.module.scss';

export interface TextAreaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  error?: string;
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  rows = 3,
  error,
  className = '',
}) => {
  return (
    <div className={`${styles.textArea} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`${styles.input} ${error ? styles.error : ''}`}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export { TextArea };
export default TextArea;
