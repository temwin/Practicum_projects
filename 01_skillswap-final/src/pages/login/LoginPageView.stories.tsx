import type { Meta, StoryObj, Decorator } from '@storybook/react-vite';
import { LoginPageView } from './LoginPageView';
import { BrowserRouter } from 'react-router-dom';

type Story = StoryObj<typeof LoginPageView>;

// Декоратор с явными типами параметров
const withRouter: Decorator = (storyFn, context) => {
  return <BrowserRouter>{storyFn(context)}</BrowserRouter>;
};

const meta: Meta<typeof LoginPageView> = {
  title: 'Pages/LoginPageView',
  component: LoginPageView,
  tags: ['autodocs'],
  decorators: [withRouter],
  argTypes: {
    formData: { control: 'object' },
    errors: { control: 'object' },
    onLogoClick: { action: 'logoClick' },
    onClose: { action: 'close' },
    onChange: { action: 'onChange' },
    onSubmit: { action: 'onSubmit' },
    onRegisterClick: { action: 'onRegisterClick' },
  },
};

export default meta;

export const EmptyForm: Story = {
  args: {
    formData: {},
    errors: {},
    onChange: () => {},
    onSubmit: () => {},
  },
};

export const ErrorWrongLogPass: Story = {
  args: {
    formData: { email: 'test@gmail.ru', password: '123' },
    errors: {
      common: 'Email или пароль неверны. Проверьте данные и попробуйте снова',
    },
    onChange: () => {},
    onSubmit: () => {},
  },
};
