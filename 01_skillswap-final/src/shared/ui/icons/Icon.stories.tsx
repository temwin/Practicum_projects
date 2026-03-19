import type { Meta, StoryObj } from '@storybook/react';
import { Icon, type IconName } from './Icon';

const iconNames: IconName[] = [
  'add',
  'chevronDown',
  'eye',
  'logout',
  'request',
  'arrowSquareLeft',
  'chevronRight',
  'filterSquare',
  'messageText',
  'scrollOne',
  'arrowSquareRight',
  'chevronUp',
  'galleryAdd',
  'moon',
  'scroll',
  'book',
  'clock',
  'galleryEdit',
  'moreSquare',
  'search',
  'briefcase',
  'count',
  'global',
  'notification',
  'share',
  'calendar',
  'cross',
  'home',
  'palette',
  'sort',
  'checkboxDone',
  'done',
  'idea',
  'plusCircle',
  'sun',
  'checkboxEmpty',
  'edit',
  'lifestyle',
  'radiobuttonActive',
  'userCircle',
  'checkboxRemove',
  'eyeSlash',
  'like',
  'radiobuttonEmpty',
  'user',
];

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
      description: 'Название иконки',
    },
    color: {
      control: 'color',
      description: 'Цвет иконки (через style)',
    },
    className: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const SingleIcon: Story = {
  args: {
    name: 'like',
    style: { color: 'var(--color-text)' },
    color: 'rgba(255, 0, 0, 1)',
  },
};

export const AllIcons: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: '1rem',
        padding: '1.5rem',
      }}
    >
      {iconNames.map((name) => (
        <div
          key={name}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
        >
          <Icon
            name={name}
            style={{
              fontSize: '24px',
              color: 'var(--color-text)',
            }}
          />
          <span
            style={{
              fontSize: '0.75rem',
              textAlign: 'center',
              color: 'var(--color-caption)',
              fontFamily: 'Roboto',
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};
