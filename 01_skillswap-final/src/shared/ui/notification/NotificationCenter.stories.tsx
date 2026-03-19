import type { Meta, StoryObj } from '@storybook/react';
import { Notification, NotificationCenter } from '.';
import { Button } from '../button';
import { useState } from 'react';

const iconNames = [
  'add',
  'chevronDown',
  'eye',
  'logout',
  'request',
  'arrowSquareLeft',
  'chevronRight',
  'filterSquare',
  'messageText',
  'scrollOne',
  'arrowSquareRight',
  'chevronUp',
  'galleryAdd',
  'moon',
  'scroll',
  'book',
  'clock',
  'galleryEdit',
  'moreSquare',
  'search',
  'briefcase',
  'count',
  'global',
  'notification',
  'share',
  'calendar',
  'cross',
  'home',
  'palette',
  'sort',
  'checkboxDone',
  'done',
  'idea',
  'plusCircle',
  'sun',
  'checkboxEmpty',
  'edit',
  'lifestyle',
  'radiobuttonActive',
  'userCircle',
  'checkboxRemove',
  'eyeSlash',
  'like',
  'radiobuttonEmpty',
  'user',
] as const;

type IconNameType = (typeof iconNames)[number];

const notificationTexts = [
  'Олег предлагает вам обмен',
  'Новое сообщение от Алины',
  'Ваш навык добавили в избранное',
  'Поступила новая заявка на обмен',
  'Напоминание: завтра встреча',
  'Профиль успешно обновлён',
  'Добро пожаловать обратно!',
  'У вас новый подписчик',
  'Срок действия навыка истекает через 3 дня',
  'Ваш отзыв опубликован',
];

const generateRandomNotification = (id: string) => {
  const randomIcon = iconNames[Math.floor(Math.random() * iconNames.length)] as IconNameType;
  const randomText = notificationTexts[Math.floor(Math.random() * notificationTexts.length)];
  return {
    id,
    icon: randomIcon,
    text: randomText,
    onGoTo: () => {},
    onDismiss: () => {},
  };
};

const meta: Meta<typeof NotificationCenter> = {
  title: 'Components/NotificationCenter',
  component: NotificationCenter,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {},
};

export default meta;

type NotificationStoryArgs = {
  icon: IconNameType | undefined;
  text: string;
  hasGoTo: boolean;
};

type Story = StoryObj<typeof NotificationCenter>;

export const NotificationExample: StoryObj<NotificationStoryArgs> = {
  render: (args) => (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <Notification
        icon={args.icon}
        text={args.text}
        onDismiss={() => {}}
        onGoTo={args.hasGoTo ? () => {} : undefined}
      />
    </div>
  ),
  args: {
    icon: 'idea',
    text: 'Олег предлагает вам обмен',
    hasGoTo: true,
  },
  argTypes: {
    icon: {
      control: 'select',
      options: [undefined, ...iconNames],
      description: 'Иконка слева',
    },
    text: {
      control: 'text',
      description: 'Текст уведомления',
    },
    hasGoTo: {
      control: 'boolean',
      description: 'Показывать кнопку "Перейти" при наведении',
    },
  },
};

export const NotificationCenterExample: StoryObj = {
  render: () => {
    const notifications = [
      { id: '1', icon: 'idea', text: 'Новое предложение обмена' },
      { id: '2', icon: 'messageText', text: 'Вам ответили на сообщение' },
      { id: '3', icon: 'like', text: 'Ваш навык добавили в избранное' },
    ].map((n) => ({
      ...n,
      icon: n.icon as IconNameType,
      onGoTo: () => {},
      onDismiss: () => {},
    }));

    return <NotificationCenter notifications={notifications} />;
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    const [notifications, setNotifications] = useState<
      Parameters<typeof NotificationCenter>[0]['notifications']
    >([]);

    const addNotification = () => {
      const newId = `notif-${Date.now()}`;
      const newNotif = generateRandomNotification(newId);
      setNotifications((prev) => [...prev, newNotif]);
    };

    return (
      <div style={{ padding: '20px' }}>
        <Button variant='primary' onClick={addNotification}>
          Добавить случайное уведомление
        </Button>
        <NotificationCenter notifications={notifications} />
      </div>
    );
  },
};
