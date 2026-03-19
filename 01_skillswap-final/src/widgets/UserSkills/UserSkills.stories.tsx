import type { Meta, StoryObj, Decorator } from '@storybook/react';
import UserSkills from './UserSkills';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Импорты из вашего приложения
import { userSlice } from '../../entities/user/model/userSlice';
import type { User, City, Skill, Subcategory, Category } from '../../api/types';

// Создаем полноценные моковые данные
const MOCK_CATEGORY: Category = {
  id: 1,
  name: 'Программирование',
};

const MOCK_SUBCATEGORY: Subcategory = {
  id: 1,
  name: 'JavaScript',
  categoryId: 1,
};

const MOCK_SKILL: Skill = {
  id: 101,
  subcategoryId: 1,
  name: 'Интенсив по JavaScript',
  description: 'Научу основам JavaScript и современным фреймворкам.',
  category: MOCK_CATEGORY,
  subcategory: MOCK_SUBCATEGORY,
};

const UNKNOWN_CITY: City = { id: -1, name: 'Неизвестный город' };

// Тип состояния auth
type AuthState = {
  currentUserId: number | null;
};

// Полное состояние Redux для стори
type RootState = {
  users: ReturnType<typeof userSlice.reducer>;
  auth: AuthState;
};

const createMockStore = (preloadedState: Partial<RootState> = {}) => {
  return configureStore({
    reducer: {
      users: userSlice.reducer,
      auth: (state = { currentUserId: null }) => state,
    },
    preloadedState: {
      users: {
        users: [],
        currentUser: null,
        credentialsByEmail: {},
        nextUserId: 51,
        isLoading: false,
        error: null,
      },
      auth: { currentUserId: null },
      ...preloadedState,
    },
  });
};

const withProviders: Decorator = (Story, context) => (
  <Provider store={createMockStore()}>
    <MemoryRouter>
      <Story {...context} />
    </MemoryRouter>
  </Provider>
);

const meta: Meta<typeof UserSkills> = {
  title: 'Widgets/UserSkills',
  component: UserSkills,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [withProviders],
};

export default meta;
type Story = StoryObj<typeof UserSkills>;

// Стори 1: С навыками (авторизованный пользователь)
export const Default: Story = {
  name: 'С навыком',
  render: () => {
    const mockUser: User = {
      id: 1,
      avatarUrl: 'https://via.placeholder.com/150/336699/FFFFFF?text=User+Avatar',
      name: 'Анна Иванова',
      location: UNKNOWN_CITY,
      dateOfBirth: '1990-01-01',
      gender: 'female',
      email: 'anna@example.com',
      password: 'secret',
      about: 'Люблю учить и учиться!',
      liked: 3,
      likedUserIds: [2, 3],
      skillCanTeach: MOCK_SKILL,
      subcategoriesWantToLearn: [MOCK_SUBCATEGORY],
      images: ['https://via.placeholder.com/600x400/336699/FFFFFF?text=JavaScript+Skills'],
    };

    const store = createMockStore({
      users: {
        users: [mockUser],
        currentUser: mockUser,
        credentialsByEmail: {
          'anna@example.com': { id: 1, email: 'anna@example.com', password: 'secret' },
        },
        nextUserId: 52,
        isLoading: false,
        error: null,
      },
      auth: { currentUserId: 1 },
    });

    return (
      <Provider store={store}>
        <div
          style={{
            padding: '2rem',
            backgroundColor: 'var(--color-background)',
            minHeight: '100vh',
          }}
        >
          <UserSkills />
        </div>
      </Provider>
    );
  },
};

// Стори 2: Пустое состояние
export const EmptyState: Story = {
  name: 'Пустое состояние',
  render: () => {
    const mockUserWithoutSkill: User = {
      id: 1,
      avatarUrl: 'https://via.placeholder.com/150/336699/FFFFFF?text=User+Avatar',
      name: 'Анна Иванова',
      location: UNKNOWN_CITY,
      dateOfBirth: '1990-01-01',
      gender: 'female',
      email: 'anna@example.com',
      password: 'secret',
      about: 'Люблю учить и учиться!',
      liked: 3,
      likedUserIds: [2, 3],
      skillCanTeach: undefined, // Нет навыка
      subcategoriesWantToLearn: [MOCK_SUBCATEGORY],
      images: [],
    };

    const store = createMockStore({
      users: {
        users: [mockUserWithoutSkill],
        currentUser: mockUserWithoutSkill,
        credentialsByEmail: {
          'anna@example.com': { id: 1, email: 'anna@example.com', password: 'secret' },
        },
        nextUserId: 52,
        isLoading: false,
        error: null,
      },
      auth: { currentUserId: 1 },
    });

    return (
      <Provider store={store}>
        <div
          style={{
            padding: '2rem',
            backgroundColor: 'var(--color-background)',
            minHeight: '100vh',
          }}
        >
          <UserSkills />
        </div>
      </Provider>
    );
  },
};

// Стори 3: Неавторизованный пользователь
export const Unauthorized: Story = {
  name: 'Неавторизованный пользователь',
  render: () => {
    const store = createMockStore({
      users: {
        users: [],
        currentUser: null,
        credentialsByEmail: {},
        nextUserId: 51,
        isLoading: false,
        error: null,
      },
      auth: { currentUserId: null }, // Нет текущего пользователя
    });

    return (
      <Provider store={store}>
        <div
          style={{
            padding: '2rem',
            backgroundColor: 'var(--color-background)',
            minHeight: '100vh',
          }}
        >
          <UserSkills />
        </div>
      </Provider>
    );
  },
};
