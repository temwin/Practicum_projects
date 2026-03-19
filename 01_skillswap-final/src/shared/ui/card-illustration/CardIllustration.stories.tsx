import type { Meta, StoryObj } from '@storybook/react';
import { CardIllustration } from './CardIllustration';
import type { CardIllustrationProps } from './CardIllustration';

/**
 * Метаданные для Storybook
 * Описывают компонент и его возможные настройки
 */
const meta: Meta<CardIllustrationProps> = {
  title: 'components/CardIllustration',
  component: CardIllustration,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Выравнивание контента внутри карточки',
    },
    spacing: {
      control: 'radio',
      options: ['normal', 'compact'],
      description: 'Плотность отступов между элементами',
    },
    image: {
      description: 'Объект с данными изображения (src, alt, width, height)',
      table: {
        type: {
          summary: 'object',
          detail: 'src: string, alt: string, width?: number, height?: number',
        },
      },
    },
    title: {
      control: 'text',
      description: 'Заголовок карточки',
    },
    description: {
      control: 'text',
      description: 'Описание карточки',
    },
    className: {
      control: 'text',
      description: 'Дополнительные CSS‑классы для корневого элемента',
    },
  },
};

export default meta;

type Story = StoryObj<CardIllustrationProps>;

/**
 * Базовый пример использования компонента
 */
export const Default: Story = {
  args: {
    image: {
      src: '/src/shared/assets/light-bulb.png',
      alt: 'Иллюстрация: идея',
      width: 300,
      height: 300,
    },
    title: 'Добро пожаловать в SkillSwap!',
    description: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
    align: 'center',
    spacing: 'normal',
  },
};

/**
 * Пример с выравниванием по левому краю
 */
export const AlignLeft: Story = {
  args: {
    ...Default.args,
    align: 'left',
  },
};

/**
 * Пример с компактными отступами
 */
export const CompactSpacing: Story = {
  args: {
    ...Default.args,
    spacing: 'compact',
  },
};

/**
 * Пример с пользовательским CSS‑классом
 */
export const WithCustomClass: Story = {
  args: {
    ...Default.args,
    className: 'custom-card-style',
  },
};

/**
 * Пример без указания ширины/высоты изображения
 * (пусть браузер определит автоматически)
 */
export const WithoutDimensions: Story = {
  args: {
    ...Default.args,
    image: {
      src: '/src/shared/assets/light-bulb.png',
      alt: 'Иллюстрация: идея',
      width: undefined,
      height: undefined,
    },
  },
};
