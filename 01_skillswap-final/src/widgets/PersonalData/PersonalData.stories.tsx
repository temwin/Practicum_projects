import type { Meta, StoryObj } from '@storybook/react';
import PersonalData, { type PersonalDataProps } from './PersonalData';

const noop = () => {};
const citiesExample = [
  { value: 'spb', label: 'Санкт-Петербург' },
  { value: 'samara', label: 'Самара' },
  { value: 'sar', label: 'Саратов' },
  { value: 'msk', label: 'Москва' },
  { value: 'ekb', label: 'Екатеринбург' },
  { value: 'novosib', label: 'Новосибирск' },
  { value: 'kazan', label: 'Казань' },
  { value: 'nsk', label: 'Нижний Новгород' },
];

const meta: Meta<typeof PersonalData> = {
  title: 'Widgets/PersonalData',
  component: PersonalData,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<PersonalDataProps>;

export const Default: Story = {
  args: {
    emailValue: 'maria@gmail.com',
    emailOnChange: noop,
    nameValue: 'Мария',
    nameOnChange: noop,
    dateValue: new Date(1995, 9, 28),
    dateOnChange: noop,
    genderValue: 'female',
    genderOnChange: noop,
    cityValue: 'msk',
    cities: citiesExample,
    cityOnChange: noop,
    aboutValue: 'Ну что мне о себе рассказать',
    aboutOnChange: noop,
    saveOnClick: () => alert('Данные сохранены!'),
    foto: 'https://i.pravatar.cc/150?img=1',
    saveDisabled: false,
  },
};
