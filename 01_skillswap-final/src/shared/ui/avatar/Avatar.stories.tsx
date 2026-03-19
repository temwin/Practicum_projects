import type { Meta, StoryObj } from '@storybook/react';
import Avatar from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  args: {
    alt: 'User avatar',
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=3',
    style: {
      width: 80,
      height: 80,
      borderRadius: '50%',
    },
  },
};

export const WithFallback: Story = {
  args: {
    src: 'https://broken-link/avatar.png',
    fallbackSrc: '/src/shared/assets/user-circle.png',
    style: {
      width: 80,
      height: 80,
      borderRadius: '50%',
    },
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Avatar
        src='https://i.pravatar.cc/100?img=10'
        style={{ width: 40, height: 40, borderRadius: '50%' }}
      />

      <Avatar
        src='https://i.pravatar.cc/150?img=11'
        style={{ width: 80, height: 80, borderRadius: '50%' }}
      />

      <Avatar
        src='https://i.pravatar.cc/200?img=12'
        style={{ width: 120, height: 120, borderRadius: '50%' }}
      />
    </div>
  ),
};

export const Clickable: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=20',
    style: {
      width: 80,
      height: 80,
      borderRadius: '50%',
      cursor: 'pointer',
    },
    onClick: () => alert('Здарова, бандиты 👋'),
  },
};

export const WithoutSrc: Story = {
  args: {
    fallbackSrc: 'https://i.pravatar.cc/150?img=30',
    style: {
      width: 80,
      height: 80,
      borderRadius: '50%',
    },
  },
};
