import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown, type DropdownOption } from './Dropdown';
import { useState } from 'react';

const cities: DropdownOption[] = [
  { value: 'spb', label: 'Санкт-Петербург' },
  { value: 'samara', label: 'Самара' },
  { value: 'sar', label: 'Саратов' },
  { value: 'msk', label: 'Москва' },
  { value: 'ekb', label: 'Екатеринбург' },
  { value: 'novosib', label: 'Новосибирск' },
  { value: 'kazan', label: 'Казань' },
  { value: 'nsk', label: 'Нижний Новгород' },
];

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Example: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <Dropdown
        label='Город'
        options={cities}
        value={value}
        onChange={setValue}
        placeholder='Не указан'
      />
    );
  },
};

export const Searchable: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <Dropdown
        label='Выберите город'
        options={cities}
        value={value}
        onChange={setValue}
        isSearchable={true}
        placeholder='Начните ввод...'
      />
    );
  },
};

export const MultipleDropdowns: Story = {
  render: () => {
    const [value1, setValue1] = useState<string>('');
    const [value2, setValue2] = useState<string>('');
    const [value3, setValue3] = useState<string>('');

    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Dropdown
            label='Город1'
            options={cities}
            value={value1}
            onChange={setValue1}
            placeholder='Выберите город'
            isSearchable
          />
          <Dropdown
            label='Город2'
            options={cities}
            value={value2}
            onChange={setValue2}
            placeholder='Выберите город'
            isSearchable
          />
          <Dropdown
            label='Город3'
            options={cities}
            value={value3}
            onChange={setValue3}
            placeholder='Выберите город'
            isSearchable
          />
        </div>
      </>
    );
  },
};

export const MultipleDropdownsFromJSON: Story = {
  render: () => {
    const [value1, setValue1] = useState<string>('');
    const [value2, setValue2] = useState<string>('');
    const [value3, setValue3] = useState<string>('');
    const [value4, setValue4] = useState<string>('');
    const [value5, setValue5] = useState<string>('');

    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Dropdown
            label='Категория'
            optionsFromJSON='category'
            value={value1}
            onChange={setValue1}
            placeholder='Выберите категорию'
          />
          <Dropdown
            label='Подкатегория 1 Категории'
            optionsFromJSON='subcategory'
            optionsFromJSONFilterId={1}
            value={value2}
            onChange={setValue2}
            placeholder='Выберите подкатегорию'
          />
          <Dropdown
            label='Умения первой подкатегории'
            optionsFromJSON='skill'
            optionsFromJSONFilterId={1}
            value={value3}
            onChange={setValue3}
            placeholder='Выберите умение'
          />
          <Dropdown
            label='Умения без фильтра'
            optionsFromJSON='skill'
            value={value3}
            onChange={setValue3}
            placeholder='Выберите умение'
          />
          <Dropdown
            label='Города'
            optionsFromJSON='city'
            value={value4}
            onChange={setValue4}
            placeholder='Выберите город'
          />
          <Dropdown
            label='Пол'
            optionsFromJSON='gender'
            value={value5}
            onChange={setValue5}
            placeholder='Выберите пол'
          />
        </div>
      </>
    );
  },
};
