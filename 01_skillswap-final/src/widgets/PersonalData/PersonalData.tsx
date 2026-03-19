import React, { useRef } from 'react';

import { TextArea } from '../../shared/ui/textarea';
import { TextInput } from '../../shared/ui/textinput';
import { Datepicker } from '../../shared/ui/datepicker';
import { Dropdown, type DropdownOption } from '../../shared/ui/dropdown';
import { Button } from '../../shared/ui/button';
import { Icon } from '../../shared/ui/icons';
import styles from './PersonalData.module.scss';
import Avatar from '../../shared/ui/avatar/Avatar';
import avatarPlaceholder from '/src/shared/assets/user-circle.png';

export interface PersonalDataProps {
  emailValue: string;
  emailOnChange: (value: string) => void;
  nameValue: string;
  nameOnChange: (value: string) => void;
  dateValue: Date | null;
  dateOnChange: (date: Date | null) => void;
  genderValue: string;
  genderOnChange: (value: string) => void;
  cityValue: string;
  cities: DropdownOption[];
  cityOnChange: (value: string) => void;
  aboutValue: string;
  aboutOnChange: (value: string) => void;
  saveDisabled?: boolean;
  saveOnClick: (newPassword?: string) => void;
  foto: string;
  iconOnClick: (file?: File) => void;
  errors?: {
    email?: string;
    name?: string;
  };
  onBlur?: (field: string) => void;
}

const PersonalData: React.FC<PersonalDataProps> = ({
  emailValue,
  emailOnChange,
  nameValue,
  nameOnChange,
  dateValue,
  dateOnChange,
  genderValue,
  genderOnChange,
  cityValue,
  cities,
  cityOnChange,
  aboutValue,
  aboutOnChange,
  saveDisabled = true,
  saveOnClick,
  foto,
  iconOnClick,
  errors,
  onBlur,
}) => {
  const [showPasswordField, setShowPasswordField] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gender: DropdownOption[] = [
    { value: 'male', label: 'мужской' },
    { value: 'female', label: 'женский' },
  ];
  // Функция, которая октрывает окно выбора файла
  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  // Функция обрабатывает выбранный файл
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      iconOnClick(file);
      event.target.value = '';
    }
  };
  return (
    <div className={styles.personalDataContainer}>
      <input
        type='file'
        ref={fileInputRef}
        accept='image/*'
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <section className={styles.info}>
        <div>
          <TextInput
            label='Почта'
            value={emailValue}
            onChange={emailOnChange}
            onBlur={() => onBlur?.('email')}
            error={errors?.email}
          />
          <p className={styles.passChange} onClick={() => setShowPasswordField((prev) => !prev)}>
            Изменить пароль
          </p>
          {showPasswordField && (
            <TextInput
              label='Новый пароль'
              value={newPassword}
              type='password'
              onChange={(v) => setNewPassword(v)}
            />
          )}
        </div>
        <TextInput
          label='Имя'
          value={nameValue}
          onChange={nameOnChange}
          onBlur={() => onBlur?.('name')}
          error={errors?.name}
        />

        <div className={styles.date_wg}>
          <Datepicker label='День рождения' value={dateValue} onChange={dateOnChange} />
          <Dropdown
            label='Пол'
            className={styles.dropdown}
            options={gender}
            value={genderValue}
            onChange={genderOnChange}
          />
        </div>
        <Dropdown
          label='Город'
          className={styles.dropdown}
          options={cities}
          value={cityValue}
          onChange={cityOnChange}
        />
        <TextArea label='О себе' value={aboutValue} onChange={aboutOnChange} />
      </section>
      <section className={styles.personalFoto}>
        <div className={styles.foto}>
          <Avatar
            key={foto}
            src={foto}
            fallbackSrc={avatarPlaceholder}
            alt={`Фотография пользователя ${nameValue}`}
            className={styles.fotoView}
          />
        </div>
        <Button variant='primary' className={styles.icon} onClick={handleIconClick}>
          <Icon name='galleryEdit' />
        </Button>
      </section>
      <section className={styles.saveButton}>
        <Button
          variant='primary'
          size='full'
          onClick={() => saveOnClick(newPassword)}
          children='Сохранить'
          disabled={saveDisabled}
        />
      </section>
    </div>
  );
};

export default PersonalData;
