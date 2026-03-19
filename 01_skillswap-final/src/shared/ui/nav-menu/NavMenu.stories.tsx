import type { Meta, StoryObj } from '@storybook/react';
import NavMenu from './NavMenu';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof NavMenu> = {
  title: 'Components/NavMenu',
  component: NavMenu,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ padding: '20px', maxWidth: '800px' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof NavMenu>;

export const Example: Story = {
  args: {
    categoriesUrl: '/db/category.json',
    subcategoriesUrl: '/db/subcategories.json',
  },
};
