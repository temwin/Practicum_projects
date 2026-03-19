import React, { useState } from 'react';
import { Button } from '../button';
import { TextInput } from '../textinput/TextInput';
import styles from './CardFirstStepRegistration.module.css';
import googleIcon from '../../assets/Google.png';
import appleIcon from '../../assets/Apple.png';
import { useSelector } from 'react-redux';
import { selectAllUsers } from '../../../entities/user/model/selectors';

export interface CardFirstStepRegistrationProps {
  /** Данные формы (email и пароль) */
  data: {
    email?: string;
    password?: string;
  };

  /** Ошибки валидации полей формы */
  errors?: {
    email?: string; // Ошибка для поля email
    password?: string; // Ошибка для поля пароля
    confirmPassword?: string; // Ошибка для подтверждения пароля
  };

  /**
   * Колбэк для обновления данных формы
   * @param data - Обновлённые данные формы (email и/или password)
   */
  onChange: (data: { email?: string; password?: string }) => void;

  /** Колбэк для перехода к следующему шагу регистрации */
  onNext: () => void;

  onBlur?: (field: string) => void;
}

export const CardFirstStepRegistration: React.FC<CardFirstStepRegistrationProps> = ({
  data,
  errors,
  onChange,
  onNext,
  onBlur,
}) => {
  // Локальное состояние для ошибок (имеет приоритет над props.errors)
  const [localErrors, setLocalErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

    // Получаем всех пользователей из стора
  const allUsers = useSelector(selectAllUsers);

  // Валидация email
  const validateEmail = (email: string | undefined): string | undefined => {
    if (!email) return 'Email обязателен';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Некорректный email';
    
    // Проверка на уникальность email
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = allUsers.find(
      (user) => user.email?.trim().toLowerCase() === normalizedEmail
    );
    if (existingUser) {
      return 'Пользователь с таким email уже существует';
    }

    return undefined;   
  };

  // Валидация пароля
  const validatePassword = (password: string | undefined): string | undefined => {
    if (!password) return 'Пароль обязателен';
    if (password.length < 8) return 'Пароль должен быть не менее 8 символов';
    if (!/[A-Z]/.test(password)) return 'Пароль должен содержать заглавную букву';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Пароль должен содержать спецсимвол';
    return undefined;
  };

  // Обработчик изменения email
  const handleEmailChange = (value: string) => {    
    onChange({ ...data, email: value });
    
    setLocalErrors(prev => ({
      ...prev,
      email: undefined
    }));
  };

  // Обработчик изменения пароля
  const handlePasswordChange = (value: string) => {   
    onChange({ ...data, password: value });
    
    setLocalErrors(prev => ({
      ...prev,
      password: undefined
    }));
  };

  // Обработчик кнопки "Далее"
  const handleNextClick = () => {
    const emailError = validateEmail(data.email);
    const passwordError = validatePassword(data.password);

    setLocalErrors({
      email: emailError,
      password: passwordError
    });

    // Если есть ошибки — не переходим
    if (emailError || passwordError) {
      return;
    }

    onNext();
  };

  // Определяем финальные ошибки: приоритет — локальные
  const finalErrors = {
    email: localErrors.email ?? errors?.email,
    password: localErrors.password ?? errors?.password
  };

  return (
    <div className={styles.container}>
      {/* Кнопки соцсетей */}
      <Button
        variant='secondary'
        size='full'
        onClick={() => {}}
        className={styles.socialButton}
      >
        <img src={googleIcon} alt='Google logo' style={{ width: 24, height: 24, marginRight: 0 }} />
        Продолжить с Google
      </Button>

      <Button
        variant='secondary'
        size='full'
        onClick={() => {}}
        className={styles.socialButton}
      >
        <img src={appleIcon} alt='Apple logo' style={{ width: 24, height: 24, marginRight: 0 }} />
        Продолжить с Apple
      </Button>

      <div className={styles.divider}>
        <span>или</span>
      </div>

      {/* Поле email */}
      <div className={styles.formField}>
        <TextInput
          type='text'
          label='Email'
          placeholder='Введите email'
          value={data.email || ''}
          onChange={handleEmailChange}
          onBlur={() => {            
            if (onBlur) onBlur('email');
          }}
          error={finalErrors.email}
          className={finalErrors.email ? styles.errorInput : ''}
        />
      </div>

      {/* Поле пароля */}
      <div className={styles.formField}>
        <TextInput
          label='Пароль'
          placeholder='Придумайте надёжный пароль'
          type='password'
          value={data.password || ''}
          onChange={handlePasswordChange}
          onBlur={() => {            
            if (onBlur) onBlur('password');
          }}
          hint='Пароль должен содержать не менее 8 знаков, заглавную букву и спецсимвол'
          error={finalErrors.password}
        />
        {!finalErrors.password && data.password && (
          <span className={styles.successMessage}>
            {data.password.length >= 8 &&
              /[A-Z]/.test(data.password) &&
              /[!@#$%^&*(),.?":{}|<>]/.test(data.password)
                ? 'Надёжный'
                : 'Слабый'}
          </span>
        )}
      </div>

      {/* Кнопка "Далее" */}
      <Button
        variant='primary'
        children='Далее'
        size='full'
        onClick={handleNextClick}
        disabled={!!(finalErrors.email || finalErrors.password)}
        className={styles.nextButton}
      />
    </div>
  );
};
