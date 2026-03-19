import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TextInput from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    type: {
      control: 'radio',
      options: ['text', 'password'],
    },
    hint: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TextInput>;

export const TextExample: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextInput {...args} value={value} onChange={setValue} />;
  },
  args: {
    label: 'Имя пользователя',
    placeholder: 'Введите имя',
    type: 'text',
  },
};

export const PasswordExample: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextInput {...args} value={value} onChange={setValue} />;
  },
  args: {
    label: 'Пароль',
    placeholder: 'Введите пароль',
    type: 'password',
    hint: 'Минимум 8 символов, латиница и цифры',
  },
};

export const WithError: Story = {
  render: (args) => {
    const [value, setValue] = useState('abc');
    return <TextInput {...args} value={value} onChange={setValue} />;
  },
  args: {
    label: 'Пароль',
    placeholder: 'Введите пароль',
    type: 'password',
    error: 'Пароль слишком короткий',
  },
};
