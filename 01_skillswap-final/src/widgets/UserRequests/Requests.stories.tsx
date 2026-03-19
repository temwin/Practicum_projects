import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import UserRequests from './UserRequests';
import type { SkillDescriptionProps } from '../SkillDescription/SkillDescription';
import type { SkillType } from '../SkillDescription/SkillDescription';

// Базовый набор изображений
const baseImages = [
  'https://placehold.co/324x324/4A90E2/FFFFFF?text=1',
  'https://placehold.co/324x324/50C878/FFFFFF?text=2',
  'https://placehold.co/324x324/FF6F61/FFFFFF?text=3',
];

//Базовый навык
const defaultSkill: SkillType = {
  id: 1,
  name: 'Веб‑разработка',
  description: 'Создание сайтов и приложений на React, TypeScript.',
  category: 'IT',
  subcategory: 'Frontend',
  images: baseImages,
  userId: 1001,
};

//Массив карточек с состоянием "Обмен предложен" (requestSent: true)
const sentRequestItems: SkillDescriptionProps[] = [
  {
    skill: { ...defaultSkill, id: 1 },
    isLiked: false,
    onLike: () => {},
    onShare: () => {},
    onMoreDetails: () => {},
    isOwner: false,
    requestSent: true,
  },
  {
    skill: {
      ...defaultSkill,
      id: 2,
      name: 'UX/UI‑дизайн',
      description: 'Проектирование интерфейсов, пользовательских сценариев.',
      category: 'Дизайн',
      subcategory: 'UI/UX',
    },
    isLiked: false,
    onLike: () => {},
    onShare: () => {},
    onMoreDetails: () => {},
    isOwner: false,
    requestSent: true,
  },
  {
    skill: {
      ...defaultSkill,
      id: 3,
      name: 'Аналитика данных',
      description: 'Работа с SQL, Python, визуализацией данных.',
      category: 'Аналитика',
      subcategory: 'Data Science',
    },
    isLiked: false,
    onLike: () => {},
    onShare: () => {},
    onMoreDetails: () => {},
    isOwner: false,
    requestSent: true,
  },
  {
    skill: {
      ...defaultSkill,
      id: 4,
      name: 'Мобильная разработка',
      description: 'Разработка под iOS и Android.',
      category: 'IT',
      subcategory: 'Mobile',
    },
    isLiked: false,
    onLike: () => {},
    onShare: () => {},
    onMoreDetails: () => {},
    isOwner: false,
    requestSent: true,
  },
  {
    skill: {
      ...defaultSkill,
      id: 5,
      name: 'Копирайт',
      description: 'Написание текстов для сайтов и соцсетей.',
      category: 'Маркетинг',
      subcategory: 'Контент',
    },
    isLiked: false,
    onLike: () => {},
    onShare: () => {},
    onMoreDetails: () => {},
    isOwner: true,
    requestSent: true,
  },
];

//Метаданные компонента
const meta: Meta<typeof UserRequests> = {
  title: 'widgets/UserRequests',
  component: UserRequests,
  decorators: [
    (Story) => (
      <div style={{ width: '1020px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

//История: список карточек с requestSent=true и вертикальным скроллом
export const RequestSent: StoryObj<typeof UserRequests> = {
  render: () => (
    <div
      style={{
        width: '1020px',
        height: '632px',
        border: '2px solid #007BFF',
        margin: '0 auto',
        overflowY: 'auto',
        padding: '8px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <UserRequests items={sentRequestItems} />
    </div>
  ),
  name: 'Обмен предложен (вертикальный скроллинг)',
};
