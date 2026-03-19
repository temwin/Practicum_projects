import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import Profile from './Profile';
import { PersonalData } from '../PersonalData';
import type { User } from '../../api/types';
import UserRequests from '../UserRequests';
import { UserExchanges } from '../UserExchanges';
import UserFavorites from '../UserFavorites/ui/UserFavorites';
import { UserSkills } from '../UserSkills';

// Моковые данные пользователя
const mockUserData: User = {
  id: 1,
  name: 'Иван Иванов',
  avatarUrl: '',
  dateOfBirth: '1990-01-01',
  gender: 'male',
  location: { id: 1, name: 'Москва' },
  about: 'Frontend разработчик с 5-летним стажем.',
  age: '33',
  liked: 10,
  skillCanTeach: {
    id: 1,
    name: 'React',
    description: '',
    subcategoryId: 1,
  },
  images: [],
  subcategoriesWantToLearn: [],
  greeting: 'Привет, я Иван!',
  likedUserIds: [],
};

// Моковые данные для UserRequests
const mockRequestItems = [
  {
    skill: {
      id: 1,
      name: 'Веб‑разработка',
      description: 'Создание сайтов и приложений на React, TypeScript.',
      category: 'IT',
      subcategory: 'Frontend',
      images: [
        'https://placehold.co/324x324/4A90E2/FFFFFF?text=1',
        'https://placehold.co/324x324/50C878/FFFFFF?text=2',
      ],
      userId: 1001,
    },
    isLiked: false,
    onLike: () => {},
    onShare: () => {},
    onMoreDetails: () => {},
    isOwner: false,
    requestSent: true,
  },
];

// Создание mock-store (пустой, т.к. в стори не нужны реальные редукторы)
const mockStore = configureStore({
  reducer: {},
  preloadedState: {},
});

const meta: Meta<typeof Profile> = {
  title: 'Widgets/Profile',
  component: Profile,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  decorators: [
    (Story, context) => (
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/profile/personal']}>
          <Routes>
            <Route
              path='/profile'
              element={
                <div
                  style={{
                    backgroundColor: 'var(--color-background)',
                    minHeight: '100vh',
                  }}
                >
                  <Story args={{ ...context.args }} />
                </div>
              }
            >
              <Route path='personal' element={<PersonalData />} />
              <Route path='requests' element={<UserRequests items={mockRequestItems} />} />
              <Route path='exchanges' element={<UserExchanges />} />
              <Route
                path='favorites'
                element={
                  <UserFavorites
                    users={[]}
                    onRemove={(id: number) => {}}
                  />
                }
              />
              <Route path='skills' element={<UserSkills />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Profile>;

export const Default: Story = {
  args: {
    userData: mockUserData,
  },
};
