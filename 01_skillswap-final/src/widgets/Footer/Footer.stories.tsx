import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './Footer';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof Footer> = {
  title: 'Widgets/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {};

export const InPageContext: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Footer />
    </div>
  ),
};
