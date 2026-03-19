# хук useForm

Кастомный хук для управления состоянием форм, валидацией и отправкой данных.

## Как использовать

### 1. Подготовка схемы валидации

Схемы хранятся в `src/shared/lib/validation/login.ts`.
Создайте новую схему, используя готовые правила из `rules.ts`.
Пример:

const mySchema = {
email: [required, isEmail],
password: [required, minLength(8)]
};

### 2. Подключение в компоненте

```tsx
import { useForm } from 'shared/lib/hooks/useForm';
import { mySchema } from 'shared/lib/validation/login';

const MyComponent = () => {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isValid } = useForm(
    { email: '', password: '' },
    mySchema
  );

  const onSubmit = (data) => {
    console.log('Данные формы:', data);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit);
      }}
    >
      <TextInput
        label='Email'
        value={values.email}
        error={touched.email ? errors.email : undefined}
        onChange={(val) => handleChange('email', val)}
        onBlur={() => handleBlur('email')}
      />

      <button disabled={!isValid}>Отправить</button>
    </form>
  );
};
```

## Основные API

- `values`: текущие значения полей.
- `errors`: объект с текстами ошибок (если есть).
- `touched`: объект, показывающий, взаимодействовал ли пользователь с полем.
- `handleChange(name, value)`: функция для обновления значения поля.
- `handleBlur(name)`: функция для пометки поля как "тронутого" (обычно вешается на `onBlur`).
- `handleSubmit(onSuccess)`: проверяет всю форму и вызывает callback, если ошибок нет.
- `isValid`: булево значение, `true` если все поля проходят валидацию.
- `setValues(newValues)`: метод для принудительного обновления всех значений (например, при загрузке данных с API).
