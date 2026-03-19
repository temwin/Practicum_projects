export const VALIDATION_MESSAGES = {
  REQUIRED: 'Поле обязательно для заполнения',
  INVALID_EMAIL: 'Введите корректный email',
  MIN_LENGTH: (min: number) => `Минимальная длина — ${min} символов`,
  MAX_LENGTH: (max: number) => `Максимальная длина — ${max} символов`,
  LOGIN_ERROR_COMMON:
    'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных',
  PASSWORD_INCORRECT: 'Пароль введён неверно. Пожалуйста проверьте правильность введённых данных',
  EMAIL_ALREADY_EXISTS: 'Email уже используется',
  RELIABLE_PASSWORD: 'Надёжный',
};
