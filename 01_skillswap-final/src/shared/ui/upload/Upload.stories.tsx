import type { Meta, StoryObj } from '@storybook/react';
import Upload from './Upload';

const meta: Meta<typeof Upload> = {
  title: 'Components/Upload',
  component: Upload,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['image', 'file'],
    },
    accept: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', maxWidth: '476px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Upload>;

export const ImageUpload: Story = {
  args: {
    mode: 'image',
    accept: 'image/*',
  },
};

export const FileUpload: Story = {
  args: {
    mode: 'file',
    accept: '.pdf,.doc,.docx,.txt',
  },
};
