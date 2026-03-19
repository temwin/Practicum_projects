import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { SkillPageUI } from './SkillPageUI';
import type { Skill, Category } from '../../api/types';

// Расширенный тип для Storybook
interface StorybookSkill extends Skill {
  userId?: number;
  images?: string[];
}

// Моковая категория
const mockCategory: Category = {
  id: 2,
  name: 'Творчество и искусство',
};

// Моковые данные для Storybook
const mockSkill: StorybookSkill = {
  id: 1,
  name: 'Игра на барабанах',
  description: 'Научу основам техники и игре любимых ритмов',
  subcategoryId: 25,
  category: mockCategory,
  subcategory: { id: 25, name: 'Музыка и звук', categoryId: 2 },
  userId: 1,
  images: [],
};

const mockSkillOwner = {
  id: 1,
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  name: 'Иван',
  location: { id: 1, name: 'Санкт-Петербург' },
  dateOfBirth: '1990-01-01',
  age: '34 года',
  gender: 'male' as const,
  about: 'Опытный барабанщик с 10-летним стажем',
  greeting: 'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое',
  liked: 42,
  skillCanTeach: {
    id: 1,
    name: 'Игра на барабанах',
    description: 'Научу основам техники и игре любимых ритмов',
    subcategoryId: 25,
    category: mockCategory,
    subcategory: { id: 25, name: 'Музыка и звук', categoryId: 2 },
    userId: 1,
    images: [],
  },
  images: [
    'https://placehold.co/324x324/4A90E2/FFFFFF?text=1',
    'https://placehold.co/324x324/50C878/FFFFFF?text=2',
    'https://placehold.co/324x324/FF6F61/FFFFFF?text=3',
  ],
  subcategoriesWantToLearn: [
    {
      id: 30,
      name: 'Тайм менеджмент',
      categoryId: 5,
    },
    {
      id: 36,
      name: 'Медитация',
      categoryId: 6,
    },
  ],
};

const mockSimilarUsers: any[] = [
  {
    id: 2,
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    name: 'Илона',
    location: { id: 2, name: 'Екатеринбург' },
    dateOfBirth: '1991-02-15',
    age: '33 года',
    gender: 'female' as const,
    about: 'Увлекаюсь музыкой и преподаванием',
    greeting: '',
    liked: 28,
    skillCanTeach: {
      id: 2,
      name: 'Английский язык',
      description: 'Преподаю английский для начинающих и продолжающих',
      subcategoryId: 15,
      category: { id: 3, name: 'Образование' },
      subcategory: { id: 15, name: 'Иностранные языки', categoryId: 3 },
      userId: 2,
      images: [],
    },
    images: [],
    subcategoriesWantToLearn: [
      {
        id: 30,
        name: 'Тайм менеджмент',
        categoryId: 5,
      },
      {
        id: 36,
        name: 'Медитация',
        categoryId: 6,
      },
    ],
  },
  {
    id: 3,
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    name: 'Алексей',
    location: { id: 3, name: 'Москва' },
    dateOfBirth: '1988-06-22',
    age: '36 лет',
    gender: 'male' as const,
    about: 'Профессиональный музыкант и преподаватель',
    greeting: 'Привет! Готов поделиться знаниями',
    liked: 35,
    skillCanTeach: {
      id: 3,
      name: 'Игра на гитаре',
      description: 'Обучение игре на гитаре с нуля',
      subcategoryId: 25,
      category: mockCategory,
      subcategory: { id: 25, name: 'Музыка и звук', categoryId: 2 },
      userId: 3,
      images: [],
    },
    images: [
      'https://placehold.co/324x324/4A90E2/FFFFFF?text=1',
      'https://placehold.co/324x324/50C878/FFFFFF?text=2',
    ],
    subcategoriesWantToLearn: [
      {
        id: 40,
        name: 'Психология',
        categoryId: 7,
      },
    ],
  },
  {
    id: 4,
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    name: 'Мария',
    location: { id: 4, name: 'Новосибирск' },
    dateOfBirth: '1993-09-10',
    age: '30 лет',
    gender: 'female' as const,
    about: 'Учитель музыки с образованием',
    greeting: 'Здравствуйте! Рада помочь в обучении',
    liked: 19,
    skillCanTeach: {
      id: 4,
      name: 'Сольфеджио',
      description: 'Основы музыкальной теории',
      subcategoryId: 25,
      category: mockCategory,
      subcategory: { id: 25, name: 'Музыка и звук', categoryId: 2 },
      userId: 4,
      images: [],
    },
    images: [],
    subcategoriesWantToLearn: [
      {
        id: 36,
        name: 'Медитация',
        categoryId: 6,
      },
    ],
  },
  {
    id: 5,
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
    name: 'Дмитрий',
    location: { id: 5, name: 'Казань' },
    dateOfBirth: '1995-12-05',
    age: '28 лет',
    gender: 'male' as const,
    about: 'Начинающий преподаватель, увлеченный музыкой',
    greeting: 'Привет! Помогу освоить основы',
    liked: 12,
    skillCanTeach: {
      id: 5,
      name: 'Ударные инструменты',
      description: 'Основы ритма и техники игры на ударных',
      subcategoryId: 25,
      category: mockCategory,
      subcategory: { id: 25, name: 'Музыка и звук', categoryId: 2 },
      userId: 5,
      images: [],
    },
    images: ['https://placehold.co/324x324/4A90E2/FFFFFF?text=1'],
    subcategoriesWantToLearn: [
      {
        id: 30,
        name: 'Тайм менеджмент',
        categoryId: 5,
      },
      {
        id: 41,
        name: 'Программирование',
        categoryId: 8,
      },
    ],
  },
];

// Создаём полноценное фиктивное Redux-хранилище
const createMockStore = () => {
  return configureStore({
    reducer: {
      // Добавляем фиктивные редьюсеры для всех используемых слайсов
      auth: (
        state = {
          currentUserId: 1,
          isAuthenticated: true,
          user: { id: 1, name: 'Текущий пользователь' },
        }
      ) => state,
      user: (
        state = {
          users: [],
          currentUser: null,
        }
      ) => state,
      subcategory: (
        state = {
          subcategories: [],
          isLoading: false,
        }
      ) => state,
      category: (
        state = {
          categories: [],
          isLoading: false,
        }
      ) => state,
      city: (
        state = {
          cities: [],
          isLoading: false,
        }
      ) => state,
      requests: (
        state = {
          requests: [],
          isLoading: false,
        }
      ) => state,
      notifications: (
        state = {
          notifications: [],
          isLoading: false,
        }
      ) => state,
      skills: (
        state = {
          skills: [],
          isLoading: false,
        }
      ) => state,
    },
    preloadedState: {
      auth: {
        currentUserId: 1,
        isAuthenticated: true,
        user: {
          id: 1,
          name: 'Текущий пользователь',
          email: 'test@example.com',
        },
      },
    },
  });
};

const meta: Meta<typeof SkillPageUI> = {
  title: 'Pages/SkillPage/SkillPageUI',
  component: SkillPageUI,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Provider store={createMockStore()}>
          <div
            style={{
              backgroundColor: '#f5f5f5',
              minHeight: '100vh',
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Story />
          </div>
        </Provider>
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SkillPageUI>;

export const Default: Story = {
  name: 'Страница навыка (не авторизован)',
  args: {
    skill: mockSkill,
    skillOwner: mockSkillOwner,
    similarUsers: mockSimilarUsers,
    isLoading: false,
    isLiked: false,
    requestSent: false,
    isOwner: false,
    error: false,
    onLikeClick: () => {},
    onShareClick: () => {},
    onMoreDetailsClick: () => {},
    onMoreOptionsClick: () => {},
    onUserClick: () => {},
    onLikeSimilarUser: () => {},
  },
};

export const Liked: Story = {
  name: 'Страница навыка (лайкнуто)',
  args: {
    skill: mockSkill,
    skillOwner: mockSkillOwner,
    similarUsers: mockSimilarUsers,
    isLoading: false,
    isLiked: true,
    requestSent: false,
    isOwner: false,
    error: false,
    onLikeClick: () => {},
    onShareClick: () => {},
    onMoreDetailsClick: () => {},
    onMoreOptionsClick: () => {},
    onUserClick: () => {},
    onLikeSimilarUser: () => {},
  },
};

export const RequestSent: Story = {
  name: 'Страница навыка (запрос отправлен)',
  args: {
    skill: mockSkill,
    skillOwner: mockSkillOwner,
    similarUsers: mockSimilarUsers,
    isLoading: false,
    isLiked: false,
    requestSent: true,
    isOwner: false,
    error: false,
    onLikeClick: () => {},
    onShareClick: () => {},
    onMoreDetailsClick: () => {},
    onMoreOptionsClick: () => {},
    onUserClick: () => {},
    onLikeSimilarUser: () => {},
  },
};

export const IsOwner: Story = {
  name: 'Страница навыка (владелец)',
  args: {
    skill: mockSkill,
    skillOwner: mockSkillOwner,
    similarUsers: mockSimilarUsers,
    isLoading: false,
    isLiked: false,
    requestSent: false,
    isOwner: true,
    error: false,
    onLikeClick: () => {},
    onShareClick: () => {},
    onMoreDetailsClick: () => {},
    onMoreOptionsClick: () => {},
    onUserClick: () => {},
    onLikeSimilarUser: () => {},
  },
};

export const Loading: Story = {
  name: 'Загрузка',
  args: {
    skill: null,
    skillOwner: null,
    similarUsers: [],
    isLoading: true,
    isLiked: false,
    requestSent: false,
    isOwner: false,
    error: false,
    onLikeClick: () => {},
    onShareClick: () => {},
    onMoreDetailsClick: () => {},
    onMoreOptionsClick: () => {},
    onUserClick: () => {},
    onLikeSimilarUser: () => {},
  },
};

export const Error: Story = {
  name: 'Ошибка',
  args: {
    skill: null,
    skillOwner: null,
    similarUsers: [],
    isLoading: false,
    isLiked: false,
    requestSent: false,
    isOwner: false,
    error: true,
    onLikeClick: () => {},
    onShareClick: () => {},
    onMoreDetailsClick: () => {},
    onMoreOptionsClick: () => {},
    onUserClick: () => {},
    onLikeSimilarUser: () => {},
  },
};
