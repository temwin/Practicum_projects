import type { Meta, StoryObj } from '@storybook/react';
import SkillDescription from './SkillDescription';

const meta = {
  title: 'Components/SkillDescription',
  component: SkillDescription,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isLiked: { control: 'boolean' },
    isOwner: { control: 'boolean' },
    requestSent: { control: 'boolean' },
    onLike: { action: 'liked' },
    onShare: { action: 'shared' },
    onMoreDetails: { action: 'more details clicked' },
    onMoreOptions: { action: 'more options clicked' },
  },
} satisfies Meta<typeof SkillDescription>;

export default meta;
type Story = StoryObj<typeof SkillDescription>;

// Базовый набор изображений
const baseImages = [
  'https://placehold.co/324x324/4A90E2/FFFFFF?text=1',
  'https://placehold.co/324x324/50C878/FFFFFF?text=2',
  'https://placehold.co/324x324/FF6F61/FFFFFF?text=3',
];

const defaultSkill = {
  id: 1,
  name: 'Игра на барабанах',
  description: 'Привет! Я играю на барабанах уже больше 10 лет...',
  category: 'Творчество и искусство',
  subcategory: 'Музыка и звук',
  userId: 123,
  images: baseImages, // Теперь передаем изображения
};

export const Default: Story = {
  args: {
    skill: defaultSkill,
    isLiked: false,
    isOwner: false,
    requestSent: false,
  },
};

export const Liked: Story = {
  args: {
    skill: defaultSkill,
    isLiked: true,
    isOwner: false,
    requestSent: false,
  },
  name: 'С лайком',
};

export const RequestSent: Story = {
  args: {
    skill: defaultSkill,
    isLiked: false,
    isOwner: false,
    requestSent: true,
  },
  name: 'Обмен предложен',
};

export const WithLongDescription: Story = {
  args: {
    skill: {
      ...defaultSkill,
      id: 3,
      name: 'Вязание свитеров',
      description:
        'Создаю теплые и стильные свитера ручной работы. Использую натуральные материалы: шерсть мериноса, альпаку, кашемир. Работаю в различных техниках: реглана, круговая вязка, жаккардовые узоры. Могу сделать свитер по вашим меркам с индивидуальным дизайном. Среднее время изготовления - 2-3 недели в зависимости от сложности. Также провожу мастер-классы для начинающих.',
      images: [
        'https://placehold.co/324x324/4A90E2/FFFFFF?text=1',
        'https://placehold.co/324x324/50C878/FFFFFF?text=2',
        'https://placehold.co/324x324/FF6F61/FFFFFF?text=3',
      ],
    },
    isLiked: true,
    isOwner: false,
    requestSent: false,
  },
  name: 'С длинным описанием',
};

export const MultipleImages: Story = {
  args: {
    skill: {
      ...defaultSkill,
      name: 'Кулинарные мастер-классы',
      description:
        'Провожу кулинарные мастер-классы по итальянской кухне. Учу готовить пасту, ризотто и тирамису.',
      images: [
        'https://placehold.co/324x324/4A90E2/FFFFFF?text=1',
        'https://placehold.co/324x324/50C878/FFFFFF?text=2',
        'https://placehold.co/324x324/FF6F61/FFFFFF?text=3',
        'https://placehold.co/324x324/9B59B6/FFFFFF?text=4',
        'https://placehold.co/324x324/F39C12/FFFFFF?text=5',
        'https://placehold.co/324x324/34495E/FFFFFF?text=6',
      ],
    },
    isLiked: true,
    isOwner: false,
    requestSent: false,
  },
  name: 'Много изображений (6+)',
};

export const OneImage: Story = {
  args: {
    skill: {
      ...defaultSkill,
      name: 'Роспись по стеклу',
      description: 'Создаю витражные картины на стекле.',
      images: ['https://placehold.co/324x324/4A90E2/FFFFFF?text=1'],
    },
    isLiked: false,
    isOwner: false,
    requestSent: false,
  },
  name: 'Одно изображение',
};

export const NoImages: Story = {
  args: {
    skill: {
      ...defaultSkill,
      name: 'Консультации по йоге',
      description: 'Провожу индивидуальные консультации по йоге.',
      images: [],
    },
    isLiked: false,
    isOwner: false,
    requestSent: false,
  },
  name: 'Без изображений',
};
