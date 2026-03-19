import type { Meta, StoryObj } from '@storybook/react';
import SkillConfirmation from './SkillConfirmation';

export default {
  title: 'Components/SkillConfirmation',
  component: SkillConfirmation,
  argTypes: {
    onEdit: { action: 'onEdit' },
    onConfirm: { action: 'onConfirm' },
    isOwner: {
      control: 'boolean',
      description: 'Является ли пользователь владельцем навыка',
    },
    requestSent: {
      control: 'boolean',
      description: 'Отправлен ли запрос на обмен',
    },
    skill: {
      table: {
        type: {
          summary: 'SkillType',
        },
      },
    },
  },
} as Meta<typeof SkillConfirmation>;

type Story = StoryObj<typeof SkillConfirmation>;

export const Primary: Story = {
  args: {
    skill: {
      name: 'Веб‑разработка на React',
      id: 1,
      description:
        'Создание интерактивных пользовательских интерфейсов с использованием библиотеки React. Опыт работы — 5 лет. ' +
        'В портфолио — 15 завершенных проектов для крупных клиентов. Специализируюсь на оптимизации производительности и доступности интерфейсов. ' +
        'Использую современные подходы: TypeScript, React Hook Form, Zustand, Tailwind CSS. Участвую в open‑source проектах.',
      category: 'IT и технологии',
      subcategory: 'Frontend‑разработка',
      images: [
        'https://picsum.photos/id/1018/800/600',
        'https://picsum.photos/id/1025/800/600', 
        'https://picsum.photos/id/1036/800/600'
      ],
      userId: 123,
    },
    isOwner: true,
    requestSent: false,
  },
};
