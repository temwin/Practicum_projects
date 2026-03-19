import type { Meta, StoryObj } from '@storybook/react-vite';
import { MainPageView } from './MainPageView';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Моковые данные (остаются без изменений)
const mockUser = {
  id: 1,
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  name: 'Александр',
  location: 'Белгород',
  age: '34 года',
  greeting: '',
  skillCanTeach: {
    id: 1,
    name: 'Создание веб-приложений на Vue.js 3',
  },
  subcategoriesWantToLearn: [
    { id: 1, name: 'Веб-разработка' },
    { id: 2, name: 'Мобильная разработка' },
    { id: 3, name: 'Мобильная разработка' },
  ],
  isLiked: false,
  likesCount: 42,
  onLikeClick: () => {},
  onDetailClick: () => {},
};

const popularUsers = [
  {
    ...mockUser,
    id: 1,
    name: 'Иван',
    location: 'Санкт-Петербург',
    skillCanTeach: { id: 1, name: 'Игра на барабанах' },
  },
  {
    ...mockUser,
    id: 2,
    name: 'Мария',
    location: 'Екатеринбург',
    skillCanTeach: { id: 2, name: 'Английский язык' },
  },
  {
    ...mockUser,
    id: 3,
    name: 'Виктория',
    location: 'Кемерово',
    skillCanTeach: { id: 3, name: 'Игра на барабанах' },
  },
];

const newUsers = [
  {
    ...mockUser,
    id: 4,
    name: 'Максим',
    location: 'Москва',
    skillCanTeach: { id: 4, name: 'Английский язык' },
  },
  {
    ...mockUser,
    id: 5,
    name: 'Елизавета',
    location: 'Владивосток',
    skillCanTeach: { id: 5, name: 'Английский язык' },
  },
  {
    ...mockUser,
    id: 6,
    name: 'Елена',
    location: 'Красноярск',
    skillCanTeach: { id: 6, name: 'Английский язык' },
  },
];

const recommendedUsers = [
  {
    ...mockUser,
    id: 7,
    name: 'Константин',
    location: 'Иркутск',
    skillCanTeach: { id: 7, name: 'Английский язык' },
  },
  {
    ...mockUser,
    id: 8,
    name: 'София',
    location: 'Абакан',
    skillCanTeach: { id: 8, name: 'Английский язык' },
  },
  {
    ...mockUser,
    id: 9,
    name: 'Александр',
    location: 'Казань',
    skillCanTeach: { id: 9, name: 'Маркетинг' },
  },
];

// Создаём фиктивное Redux-хранилище
const createMockStore = () => {
  return configureStore({
    reducer: {}, // Можно добавить редукторы, если нужно
    preloadedState: {}, // Или заполнить начальное состояние
  });
};

const meta: Meta<typeof MainPageView> = {
  title: 'Pages/MainPageView',
  component: MainPageView,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Provider store={createMockStore()}>
          <Story />
        </Provider>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MainPageView>;

// Базовый стори (не авторизован)
export const Default: Story = {
  args: {
    popularUsers,
    newUsers,
    recommendedUsers,
    isAuth: false,
    searchValue: '',
    isMatchMode: false,
    matchUsers: [],
    filters: {
      skillType: 'all', // явно задаём
      gender: 'all', // явно задаём
      selectedSkills: [], // пустой массив
      selectedCities: [], // пустой массив
    },
    onFiltersChange: () => {},
    onLikeClick: () => {},
  },
};
