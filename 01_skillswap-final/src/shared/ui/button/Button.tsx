import React from 'react';
import styles from './Button.module.scss';
import { Icon, type IconName } from '../icons';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'content' | 'full';
export type IconPosition = 'left' | 'right';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  hasIcon?: boolean;
  iconName?: IconName;
  iconPosition?: IconPosition;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'content',
  children,
  hasIcon = false,
  iconName = 'add',
  iconPosition = 'right',
  className,
  ...props
}) => {
  const buttonClass = [
    styles.button,
    styles[variant],
    size === 'full' && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const renderIcon = () => {
    if (!hasIcon || !iconName) return null;
    return <Icon name={iconName} className={styles.icon} />;
  };

  const icon = renderIcon();

  return (
    <button className={buttonClass} {...props}>
      {iconPosition === 'left' && icon}
      {children}
      {iconPosition === 'right' && icon}
    </button>
  );
};

export default Button;
