import { VALIDATION_MESSAGES } from './messages';

export type ValidationRule<T = unknown> = (value: T) => string | undefined;

export const required: ValidationRule = (value) => {
  if (value === undefined || value === null) return VALIDATION_MESSAGES.REQUIRED;
  if (typeof value === 'string' && !value.trim()) return VALIDATION_MESSAGES.REQUIRED;
  if (Array.isArray(value) && value.length === 0) return VALIDATION_MESSAGES.REQUIRED;
  return undefined;
};

export const isEmail: ValidationRule = (value) => {
  if (typeof value !== 'string') return VALIDATION_MESSAGES.INVALID_EMAIL;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value) ? undefined : VALIDATION_MESSAGES.INVALID_EMAIL;
};

export const minLength =
  (min: number, message?: string): ValidationRule =>
  (value) => {
    const val = typeof value === 'string' || Array.isArray(value) ? value : String(value || '');
    return val.length >= min ? undefined : message || VALIDATION_MESSAGES.MIN_LENGTH(min);
  };

export const maxLength =
  (max: number, message?: string): ValidationRule<unknown> =>
  (value) => {
    const val = typeof value === 'string' || Array.isArray(value) ? value : String(value || '');
    return val.length <= max ? undefined : message || VALIDATION_MESSAGES.MAX_LENGTH(max);
  };

export const hasUppercase: ValidationRule<unknown> = (value) => {
  if (typeof value !== 'string') return undefined;
  return /[A-Z]/.test(value) ? undefined : 'Пароль должен содержать заглавную букву';
};

export const hasSpecialChar: ValidationRule<unknown> = (value) => {
  if (typeof value !== 'string') return undefined;
  return /[!@#$%^&*(),.?":{}|<>]/.test(value) ? undefined : 'Пароль должен содержать спецсимвол';
};
