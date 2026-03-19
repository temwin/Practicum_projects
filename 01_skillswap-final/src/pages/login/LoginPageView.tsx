import React from 'react';
import { HeaderLogin } from '../../shared/ui/header-login/HeaderLogin';
import { CardIllustration } from '../../shared/ui/card-illustration/CardIllustration';
import { Button } from '../../shared/ui/button';
import { TextInput } from '../../shared/ui/textinput/TextInput';
import { Text } from '../../shared/ui/text';

import googleIcon from '../../shared/assets/Google.png';
import appleIcon from '../../shared/assets/Apple.png';

import styles from './LoginPageView.module.css';
export type LoginFormData = {
  email?: string;
  password?: string;
};

export type LoginErrors = {
  email?: string;
  password?: string;
  common?: string;
};

interface LoginPageViewProps {
  formData: LoginFormData;
  errors?: LoginErrors;

  onBlur?: (name: keyof LoginFormData) => void;

  onLogoClick?: () => void;
  onClose?: () => void;

  onChange: (data: LoginFormData) => void;
  onSubmit: () => void;
  onRegisterClick?: () => void;
}

export const LoginPageView: React.FC<LoginPageViewProps> = ({
  formData,
  errors,
  onBlur,
  onLogoClick,
  onClose,
  onChange,
  onSubmit,
  onRegisterClick,
}) => {
  return (
    <div className={styles.page}>
      <HeaderLogin onLogoClick={onLogoClick} onClose={onClose} />

      <div className={styles.pageTitle}>
        <Text variant='h2'>Вход</Text>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.card}>
          <div className={styles.formContainer}>
            <Button variant='secondary' size='full' type='button' className={styles.socialButton}>
              <img src={googleIcon} alt='Google logo' className={styles.socialIcon} />
              Продолжить с Google
            </Button>

            <Button variant='secondary' size='full' type='button' className={styles.socialButton}>
              <img src={appleIcon} alt='Apple logo' className={styles.socialIcon} />
              Продолжить с Apple
            </Button>

            <div className={styles.divider}>
              <span>или</span>
            </div>

            <div className={styles.field}>
              <TextInput
                type='text'
                label='Email'
                placeholder='Введите email'
                value={formData.email || ''}
                onChange={(value: string) => onChange({ ...formData, email: value })}
                onBlur={() => onBlur?.('email')}
                error={errors?.email}
              />
            </div>

            <div className={styles.field}>
              <TextInput
                label='Пароль'
                placeholder='Введите ваш пароль'
                type='password'
                value={formData.password || ''}
                onChange={(value: string) => onChange({ ...formData, password: value })}
                onBlur={() => onBlur?.('password')}
                error={errors?.password || errors?.common}
              />
            </div>

            <Button
              variant='primary'
              size='full'
              type='button'
              onClick={onSubmit}
              className={styles.loginButton}
            >
              Войти
            </Button>

            <button type='button' className={styles.registerLink} onClick={onRegisterClick}>
              Зарегистрироваться
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.illustrationInner}>
            <CardIllustration
              image={{
                src: '/src/shared/assets/light-bulb.png',
                alt: 'Иллюстрация: идея',
                width: 300,
                height: 300,
              }}
              title='С возвращением в SkillSwap!'
              description='Обменивайтесь знаниями и навыками с другими людьми'
              align='center'
              spacing='normal'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
