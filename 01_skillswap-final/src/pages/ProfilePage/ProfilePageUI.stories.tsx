import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { ProfilePageUI } from './ProfilePageUI';
import { PersonalData } from '../../widgets/PersonalData';
import type { User } from '../../api/types';
import UserRequests from '../../widgets/UserRequests';
import { UserExchanges } from '../../widgets/UserExchanges';
import UserFavorites from '../../widgets/UserFavorites/ui/UserFavorites';
import { UserSkills } from '../../widgets/UserSkills';

// Моковые данные с правильным типом User
const mockUserData: User = {
  id: 1,
  name: 'Иван Иванов',
  avatarUrl: '',
  dateOfBirth: '1990-01-01',
  gender: 'male',
  location: { id: 1, name: 'Москва' },
  about: 'Frontend разработчик с 5-летним стажем.',
  skillCanTeach: { id: 1, name: 'React', description: '', subcategoryId: 1 },
  images: [],
  subcategoriesWantToLearn: [],
  greeting: 'Привет, я Иван!',
  likedUserIds: [],
  liked: 10,
};

// Используем реальный тип для запросов
const mockRequestItems = [
  {
    id: 1,
    skillId: 1,
    fromUserId: 2,
    toUserId: 1,
    status: 'pending',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

const mockFavoriteUsers: User[] = [
  {
    id: 1,
    name: 'Александр Иванов',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    location: { id: 1, name: 'Белгород' },
    about: '',
    skillCanTeach: {
      id: 1,
      name: 'Создание веб-приложений на Vue.js 3',
      description: '',
      subcategoryId: 1,
    },
    images: [],
    subcategoriesWantToLearn: [{ id: 1, name: 'Веб-разработка', categoryId: 1 }],
    greeting: '',
    likedUserIds: [],
    liked: 42,
  },
];

// Создаём фиктивное Redux-хранилище
const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: (
        state = {
          isAuthenticated: true,
          currentUserId: 1,
          user: mockUserData,
        }
      ) => state,
      user: (
        state = {
          users: [mockUserData, ...mockFavoriteUsers],
          currentUser: mockUserData,
        }
      ) => state,
      requests: (
        state = {
          requests: mockRequestItems,
        }
      ) => state,
    },
    preloadedState: {},
  });
};

const meta: Meta<typeof ProfilePageUI> = {
  title: 'Pages/ProfilePageUI',
  component: ProfilePageUI,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  decorators: [
    (Story, context) => (
      <MemoryRouter initialEntries={['/profile/personal']}>
        <Provider store={createMockStore()}>
          <Routes>
            <Route
              path='/profile'
              element={
                <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
                  <Story args={{ ...context.args }} />
                </div>
              }
            >
              <Route path='personal' element={<PersonalData />} />
              <Route path='requests' element={<UserRequests />} />
              <Route path='exchanges' element={<UserExchanges />} />
              <Route
                path='favorites'
                element={
                  <UserFavorites
                    users={mockFavoriteUsers}
                    onRemove={() => {}}
                    onUserClick={() => {}}
                  />
                }
              />
              <Route path='skills' element={<UserSkills />} />
            </Route>
          </Routes>
        </Provider>
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ProfilePageUI>;

export const Default: Story = {
  args: {
    userData: mockUserData,
    headerOnSearchChange: () => {},
    headerOnLogout: () => {},
    headerOnCompactActionClick: () => {},
  },
};
