import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeaderLogin } from './HeaderLogin';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof HeaderLogin> = {
  title: 'components/HeaderLogin',
  component: HeaderLogin,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    // Отключаем предупреждение Storybook о возможном отсутствии провайдера
    layout: 'fullscreen', // опционально: для лучшего отображения header
  },
};

export default meta;

type Story = StoryObj<typeof HeaderLogin>;

export const Default: Story = {
  args: {
    onLogoClick: () => {},
    onClose: () => {},
  },
};
