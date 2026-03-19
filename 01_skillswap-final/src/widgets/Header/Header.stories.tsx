import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';
import { MemoryRouter } from 'react-router-dom';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../../features/auth';
import { userReducer } from '../../entities/user/model';

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
  },
  preloadedState: {
    auth: {
      currentUserId: null,
      isAuthenticated: false,
      status: 'idle' as const,
      error: null,
      redirectTo: null,
    },
    users: {
      users: [],
      currentUser: null,
      credentialsByEmail: {},
      nextUserId: 1,
      isLoading: false,
      error: null,
    },
  },
});

const meta: Meta<typeof Header> = {
  title: 'Widgets/Header',
  component: Header,
  decorators: [
    (Story) => (
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Provider store={mockStore}>
          <div style={{ background: 'var(--color-background)' }}>
            <Story />
          </div>
        </Provider>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    isAuth: {
      control: 'boolean',
      description: 'Пользователь авторизован',
    },
    showSearch: {
      control: 'boolean',
      description: 'Показывать поле поиска',
    },
    notificationsCount: {
      control: 'number',
      description: 'Количество уведомлений',
    },
    searchValue: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

const HeaderWithSearchState = (props: any) => {
  const [searchValue, setSearchValue] = useState(props.searchValue || '');
  return <Header {...props} searchValue={searchValue} onSearchChange={setSearchValue} />;
};

export const Unauthenticated: Story = {
  render: (args) => <HeaderWithSearchState {...args} />,
  args: {
    isAuth: false,
    showSearch: true,
    showMenu: true,
    compactActions: false,
    pushToLeft: true,
    searchValue: '',
  },
};

export const Authenticated: Story = {
  render: (args) => <HeaderWithSearchState {...args} />,
  args: {
    isAuth: true,
    showSearch: true,
    showMenu: true,
    compactActions: false,
    pushToLeft: true,
    searchValue: '',
  },
};

export const AuthenticatedNoSearch: Story = {
  args: {
    isAuth: true,
    showSearch: false,
    showMenu: true,
    pushToLeft: true,
    compactActions: false,
  },
};

export const UnauthenticatedNoSearch: Story = {
  args: {
    isAuth: false,
    showSearch: false,
    showMenu: true,
    pushToLeft: true,
    compactActions: false,
  },
};

export const LoginMode: Story = {
  args: {
    isAuth: false,
    showSearch: false,
    showMenu: false,
    pushToLeft: false,
    compactActions: true,
  },
};
