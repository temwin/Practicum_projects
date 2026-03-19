import type { Meta, StoryObj } from '@storybook/react';
import Logo from './Logo';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof Logo> = {
  title: 'components/Logo',
  component: Logo,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Logo>;

export const Default: Story = {};
