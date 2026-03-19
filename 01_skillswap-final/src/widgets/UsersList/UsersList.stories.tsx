import type { Meta, StoryObj, Decorator } from '@storybook/react';
import UsersList from './index';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../../entities/user/model/userSlice';
import type { User, Skill, Subcategory, City } from '../../api/types';

// 1. Создаём фиктивное хранилище Redux для стори
const createMockStore = () => {
  return configureStore({
    reducer: {
      users: userSlice.reducer,
    },
    preloadedState: {
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
};

// 2. Декоратор для обёртки стори в Provider
const withReduxProvider: Decorator = (Story) => (
  <Provider store={createMockStore()}>
    <Story />
  </Provider>
);

// 3. Метаданные стори с декоратором
const meta: Meta<typeof UsersList> = {
  title: 'Widgets/UsersList',
  component: UsersList,
  decorators: [withReduxProvider],
};

export default meta;
type Story = StoryObj<typeof UsersList>;

// 4. Моковые данные пользователей (с обязательными полями User)
const mockUsers: (Omit<User, 'skillCanTeach' | 'subcategoriesWantToLearn'> & {
  skillCanTeach: Skill;
  subcategoriesWantToLearn: Subcategory[];
  location: City;
})[] = [
  {
    id: 1,
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    name: 'Александр Иванов',
    location: { id: 1, name: 'Москва' },
    dateOfBirth: '1990-05-15',
    gender: 'male',
    about: 'Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое',
    skillCanTeach: {
      id: 1,
      subcategoryId: 1,
      name: 'Scrum в реальных проектах',
      description: 'Практическое применение Scrum в IT-командах',
    },
    subcategoriesWantToLearn: [
      { id: 9, name: 'Английский', categoryId: 1 },
      { id: 25, name: 'Музыка и звук', categoryId: 3 },
      { id: 36, name: 'Йога и медитация', categoryId: 5 },
    ],
  },
  {
    id: 2,
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    name: 'Мария Петрова',
    location: { id: 2, name: 'Санкт-Петербург' },
    dateOfBirth: '1989-08-22',
    gender: 'female',
    about: 'Преподаю английский с 2015 года',
    skillCanTeach: {
      id: 4,
      subcategoryId: 4,
      name: 'Английский для IT-специалистов',
      description: 'Специализированный курс для разработчиков',
    },
    subcategoriesWantToLearn: [
      { id: 7, name: 'Проектное управление', categoryId: 2 },
      { id: 30, name: 'Личностное развитие', categoryId: 6 },
      { id: 42, name: 'Баланс жизни и работы', categoryId: 7 },
    ],
  },
  {
    id: 3,
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    name: 'Дмитрий Смирнов',
    location: { id: 3, name: 'Новосибирск' },
    dateOfBirth: '1992-11-03',
    gender: 'male',
    about: 'Профессиональный звукорежиссёр, делюсь опытом',
    skillCanTeach: {
      id: 5,
      subcategoryId: 5,
      name: 'Сведение музыки в Ableton Live',
      description: 'Техники профессионального сведения',
    },
    subcategoriesWantToLearn: [
      { id: 18, name: 'Приготовление еды', categoryId: 4 },
      { id: 37, name: 'Питание и ЗОЖ', categoryId: 8 },
      { id: 40, name: 'Физические тренировки', categoryId: 9 },
    ],
  },
  {
    id: 4,
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    name: 'Анна Козлова',
    location: { id: 4, name: 'Екатеринбург' },
    dateOfBirth: '1991-02-14',
    gender: 'female',
    about: 'Практикую медитацию более 5 лет',
    skillCanTeach: {
      id: 6,
      subcategoryId: 6,
      name: 'Медитация для начинающих',
      description: 'Основы осознанности и релаксации',
    },
    subcategoriesWantToLearn: [
      { id: 22, name: 'Рисование и иллюстрация', categoryId: 10 },
      { id: 35, name: 'Коучинг', categoryId: 11 },
      { id: 38, name: 'Ментальное здоровье', categoryId: 12 },
    ],
  },
  {
    id: 5,
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    name: 'Сергей Васильев',
    location: { id: 5, name: 'Казань' },
    dateOfBirth: '1988-07-21',
    gender: 'male',
    about: 'Фронтенд‑разработчик с 8‑летним стажем',
    skillCanTeach: {
      id: 7,
      subcategoryId: 7,
      name: 'React и TypeScript',
      description: 'Современные подходы к фронтенд-разработке',
    },
    subcategoriesWantToLearn: [
      { id: 15, name: 'Дизайн интерфейсов', categoryId: 13 },
      { id: 28, name: 'Копирайтинг', categoryId: 14 },
      { id: 41, name: 'Тайм-менеджмент', categoryId: 15 },
    ],
  },
  {
    id: 6,
    avatarUrl: 'https://i.pravatar.cc/150?img=6',
    name: 'Ольга Новикова',
    location: { id: 6, name: 'Ростов-на-Дону' },
    dateOfBirth: '1993-04-10',
    gender: 'female',
    about: 'Дизайнер с опытом работы в Figma',
    skillCanTeach: {
      id: 8,
      subcategoryId: 8,
      name: 'Figma и веб-дизайн',
      description: 'Создание прототипов и дизайн-систем',
    },
    subcategoriesWantToLearn: [
      { id: 12, name: 'Маркетинг', categoryId: 16 },
      { id: 33, name: 'Публичные выступления', categoryId: 17 },
      { id: 45, name: 'Самомотивация', categoryId: 18 },
    ],
  },
];

// 5. Стори
export const All: Story = {
  name: 'Подходящие предложения (3 карточки + кнопка "Сначала новые")',
  args: {
    title: 'Подходящие предложения',
    mode: 'all',
    users: mockUsers,
  },
};

export const Popular: Story = {
  name: 'Популярное (3 карточки + кнопка "Смотреть все")',
  args: {
    title: 'Популярное',
    mode: 'popular',
    users: mockUsers,
  },
};

export const Likes: Story = {
  name: 'Похожие предложения (4 карточки + БЕЗ кнопки)',
  args: {
    title: 'Похожие предложения',
    mode: 'likes',
    users: mockUsers,
  },
};

export const New: Story = {
  name: 'Новое (3 карточки + кнопка "Смотреть все")',
  args: {
    title: 'Новое',
    mode: 'created',
    users: mockUsers,
  },
};

export const Recommended: Story = {
  name: 'Рекомендуем (3 карточки БЕЗ кнопки)',
  args: {
    title: 'Рекомендуем',
    mode: 'recommended',
    users: mockUsers,
  },
};

export const AllVariations: Story = {
  name: 'Все варианты в одном',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
      <div>
        <h3 style={{ marginBottom: '20px' }}>
          Подходящие предложения (3 карточки + кнопка сортировки)
        </h3>
        <UsersList title='Подходящие предложения' mode='all' users={mockUsers} />
      </div>

      <div>
        <h3 style={{ marginBottom: '20px' }}>Популярное (3 карточки + кнопка)</h3>
        <UsersList title='Популярное' mode='popular' users={mockUsers} />
      </div>

      <div>
        <h3 style={{ marginBottom: '20px' }}>Похожие предложения (4 карточки + БЕЗ кнопки)</h3>
        <UsersList title='Похожие предложения' mode='likes' users={mockUsers} />
      </div>

      <div>
        <h3 style={{ marginBottom: '20px' }}>Новое (3 карточки + кнопка "Смотреть все")</h3>
        <UsersList title='Новое' mode='created' users={mockUsers} />
      </div>

      <div>
        <h3 style={{ marginBottom: '20px' }}>Рекомендуем (3 карточки БЕЗ кнопки)</h3>
        <UsersList title='Рекомендуем' mode='recommended' users={mockUsers} />
      </div>
    </div>
  ),
};
