import type { Meta, StoryObj } from '@storybook/react';
import Tag from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['business', 'creation', 'langs', 'education', 'home', 'health', 'plus'],
    },
    children: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const AllTags: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Tag type='business'>Бизнес</Tag>
      <Tag type='creation'>Искусство</Tag>
      <Tag type='langs'>Английский</Tag>
      <Tag type='education'>Математика</Tag>
      <Tag type='home'>Ремонт</Tag>
      <Tag type='health'>Йога</Tag>
      <Tag type='plus'>Новое</Tag>
    </div>
  ),
};
