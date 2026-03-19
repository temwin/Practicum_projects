import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar, SidebarItem } from '.';
import { Icon } from '../icons';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ display: 'flex', height: '400px', width: '250px' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Example: Story = {
  render: () => (
    <Sidebar>
      <SidebarItem icon={<Icon name='request' />} label='Заявки' to='/' isActive={true} />
      <SidebarItem icon={<Icon name='messageText' />} label='Мои обмены' to='/' />
      <SidebarItem icon={<Icon name='like' />} label='Избранное' to='/' />
      <SidebarItem icon={<Icon name='idea' />} label='Мои навыки' to='/' />
      <SidebarItem icon={<Icon name='user' />} label='Личные данные' to='/profile' />
    </Sidebar>
  ),
};

export const SidebarItems: Story = {
  render: () => <SidebarItem icon={<Icon name='home' />} label='Главная' to='/' />,
};
