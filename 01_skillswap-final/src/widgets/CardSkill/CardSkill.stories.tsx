import { MemoryRouter } from 'react-router-dom';
import { CardSkill } from './CardSkill';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CardSkill> = {
  title: 'Widgets/CardSkill',
  component: CardSkill,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ padding: '40px' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CardSkill>;

const mockUser = {
  id: 1,
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  name: 'Александр Иванов',
  location: {
    id: 1,
    name: 'Белгород',
  },
  age: '34 года',
  dateOfBirth: '1990-01-01',
  gender: 'male',
  about: 'Опытный разработчик с 10-летним стажем',
  greeting: 'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое',
  skillCanTeach: {
    id: 1,
    subcategoryId: 1,
    name: 'Создание веб-приложений на Vue.js 3',
    description: 'Научу создавать современные веб-приложения',
    category: {
      id: 1,
      name: 'Бизнес и карьера',
    },
  },
  subcategoriesWantToLearn: [
    {
      id: 1,
      name: 'Веб-разработка',
      categoryId: 2,
    },
    {
      id: 2,
      name: 'Мобильная разработка',
      categoryId: 3,
    },
    {
      id: 3,
      name: 'Дизайн',
      categoryId: 4,
    },
  ],
};

export const CompactCard: Story = {
  name: 'Compact (Без лайка и кнопкой)',
  args: {
    user: mockUser,
    variant: 'compact',
    isLiked: false,
    likesCount: 42,
    onLikeClick: () => {},
    onDetailClick: () => {},
  },
};

export const CompactCardisLiked: Story = {
  name: 'Compact (С лайком и кнопкой)',
  args: {
    user: mockUser,
    variant: 'compact',
    isLiked: true,
    likesCount: 42,
    onLikeClick: () => {},
    onDetailClick: () => {},
  },
};

export const DetailedCard: Story = {
  name: 'Detailed (Без лайка и кнопки)',
  args: {
    user: mockUser,
    variant: 'detailed',
  },
};
