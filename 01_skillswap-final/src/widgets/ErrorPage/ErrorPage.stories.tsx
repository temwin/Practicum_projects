import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import ErrorPage from './ErrorPage';

const meta: Meta<typeof ErrorPage> = {
  title: 'Widgets/ErrorPage',
  component: ErrorPage,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ padding: '20px' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    errorType: {
      control: 'radio',
      options: [404, 500],
      description: 'Тип ошибки',
    },
    onRetry: { action: 'retry clicked', description: 'Обработчик кнопки "Сообщить об ошибке"' },
  },
};

export default meta;

type Story = StoryObj<typeof ErrorPage>;

export const Error404: Story = {
  args: {
    errorType: 404,
  },
};

export const Error500: Story = {
  args: {
    errorType: 500,
  },
};
