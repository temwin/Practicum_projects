import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useRef,
  useState
} from 'react';
import { IFormProps } from './types';

import styles from './form.module.css';
import clsx from 'clsx';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput
} from '@ya.praktikum/react-developer-burger-ui-components';
// Используйте для проверки формата введённого имени
import { namePattern } from '../../utils/constants';

export const Form: FC<IFormProps> = ({ setMode, className }) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState(false);
  const [repeatPassword, setRepeatPassword] = useState('');

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      setRepeatPasswordError(true);
      return;
    } else {
      setRepeatPasswordError(false);
    }
    setMode('complete');
  };

  const handleNameChange:ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setName(target.value);
    setNameError(!namePattern.test(target.value));
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setPassword(target.value);
    setRepeatPasswordError(!!repeatPassword && target.value !== repeatPassword);
  };

  const handleRepeatPasswordChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setRepeatPassword(target.value);
    setRepeatPasswordError(!!password && target.value !== password)
  };

  const isFormValid =
    name && !nameError && email && email.includes('@') && password.length >= 6 && repeatPassword.length >= 6 && !repeatPasswordError;

  return (
    <form
      ref={formRef}
      className={clsx(styles.form, className)}
      data-testid='form'
      onSubmit={handleSubmit}
    >
      <div className={styles.icon} />
      <div className={styles.text_box}>
        <p className='text text_type_main-large'>Мы нуждаемся в вашей силе!</p>
        <p className={clsx(styles.text, 'text text_type_main-medium')}>
          Зарегистрируйтесь на нашей платформе, чтобы присоединиться к списку
          контрибьюторов
        </p>
      </div>
      <fieldset className={styles.fieldset}>
        {/* ИМЯ */}
        <Input
          type='text'
          placeholder='Имя'
          name='name'
          data-testid='name-input'
          required
          value={name}
          onChange={handleNameChange}
          error={nameError}
          errorText='Некорректный формат имени'
        />
        {/* Email */}
        <EmailInput
          name='email'
          data-testid='email-input'
          required
          value={email}
          onChange={handleEmailChange}
        />
        {/* Пароль */}
        <PasswordInput
          name='password'
          data-testid='password-input'
          required
          value={password}
          onChange={handlePasswordChange}
        />
        {/* Повтор пароля */}
        <PasswordInput
          name='repeatPassword'
          placeholder='Повторите пароль'
          data-testid='repeat-password-input'
          required
          value={repeatPassword}
          onChange={handleRepeatPasswordChange}
          extraClass={clsx(styles.input, { [styles.input_error]: repeatPasswordError })}
        />
        {repeatPasswordError && (<p className='text input__error text_type_main-default mt-2 mb-2'>Пароли не совпадают</p>)}
        {/* Кнопка отправки */}
        <Button htmlType='submit' type='primary' size='medium' disabled={!formRef.current?.checkValidity()}>
          Зарегистрироваться
        </Button>
      </fieldset>
      <div className={styles.signin_box}>
        <p className='text text_type_main-default text_color_inactive'>
          Уже зарегистрированы?
        </p>
        <Button
          htmlType='button'
          type='secondary'
          size='medium'
          extraClass={styles.signin_btn}
        >
          Войти
        </Button>
      </div>
    </form>
  );
};
