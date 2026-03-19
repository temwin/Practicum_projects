import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RegisterPage from './RegisterPage';
import type { RegisterPageProps } from './RegisterPage';
import { userReducer } from '../../entities/user/model';
import type { RegistrationData } from '../../widgets/RegistrationWizard/RegistrationWizard';

// Расширенный тип для историй
type StoryProps = RegisterPageProps & {
  onSubmit?: (data: RegistrationData) => void;
};

// начальное состояние: включает все обязательные поля UserState
const mockInitialUserState = {
  users: [],
  currentUser: null, // Явно указываем null (соответствует типу User | null)
  credentialsByEmail: {},
  nextUserId: 1,
  isLoading: false,
  error: null,
};

const mockStore = configureStore({
  reducer: {
    users: userReducer,
  },
  preloadedState: {
    users: mockInitialUserState,
  },
});

const meta: Meta<StoryProps> = {
  title: 'Pages/RegisterPage',
  component: RegisterPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'gray', value: '#f5f5f5' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <Router>
        <Provider store={mockStore}>
          <Story />
        </Provider>
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Default: Story = {
  args: {
    onLogoClick: () => {},
    onClose: () => {},
  },
};

export const WithSubmitHandler: Story = {
  args: {
    onLogoClick: () => {},
    onClose: () => {},
    onSubmit: (data: RegistrationData) => {
      alert(
        `Регистрация завершена!\n` +
          `Email: ${data.email || 'не указан'}\n` +
          `Имя: ${data.name || 'не указано'}`
      );
    },
  },
};

export const Closed: Story = {
  args: {
    onLogoClick: () => {},
    onClose: () => {},
  },
};
