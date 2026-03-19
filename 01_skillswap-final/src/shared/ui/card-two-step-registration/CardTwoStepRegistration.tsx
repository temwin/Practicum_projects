import React, { useState } from 'react';
import { TextInput } from '../textinput/TextInput';
import { Datepicker } from '../datepicker';
import { Button } from '../button';
import { Dropdown } from '../dropdown/Dropdown';
import styles from './CardTwoStepRegistration.module.css';
import Avatar from '../avatar/Avatar';
import avatarSrc from '../../assets/Icon+Add.png';
import { Multiselect } from '../multiselect';

export interface SkillSelection {
  name: string;
  categoryId: number;
  subcategoryId: number;
}

export interface CardTwoStepRegistrationProps {
  data: {
    name?: string;
    birthDate?: string;
    gender?: string;
    idCity?: number;
    city?: string;
    wantToLearn?: SkillSelection[];
    avatarBase64?: string;
  };
  errors?: {
    name?: string;
    birthDate?: string;
    gender?: string;
    city?: string;
    wantToLearn?: string;
  };
  onChange: (data: Partial<CardTwoStepRegistrationProps['data']>) => void;
  onBlur?: (field: string) => void;
  onBack?: () => void;
  onNext?: () => void;
}

const CardTwoStepRegistration: React.FC<CardTwoStepRegistrationProps> = ({
  data,
  errors,
  onChange,
  onBlur,
  onBack,
  onNext,
}) => {
  const [localErrors, setLocalErrors] = useState<{
    name?: string;
    birthDate?: string;
    gender?: string;
    city?: string;
    wantToLearn?: string;
  }>({});

  const [selectedCategories, setSelectedCategories] = useState<number[]>(() => {
    const categories = (data.wantToLearn || []).map((skill) => skill.categoryId);
    return Array.from(new Set(categories));
  });

  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>(() => {
    if (selectedCategories.length === 0) return [];
    const validSubcategories = (data.wantToLearn || [])
      .filter((skill) => selectedCategories.includes(skill.categoryId))
      .map((skill) => skill.subcategoryId);
    return Array.from(new Set(validSubcategories));
  });

  // Валидация полей
  const validateField = (field: string, value: any): string | undefined => {
    switch (field) {
      case 'name':
        return value?.trim() ? undefined : 'Имя обязательно';
      case 'birthDate':
        return value ? undefined : 'Дата рождения обязательна';
      case 'gender':
        return value ? undefined : 'Пол обязателен';
      case 'city':
        return value?.trim() ? undefined : 'Город обязателен';
      case 'wantToLearn':
        return (value || []).length > 0 ? undefined : 'Выберите хотя бы один навык';
      default:
        return undefined;
    }
  };

  // Финальные ошибки (приоритет: localErrors → props.errors)
  const finalErrors = {
    name: localErrors.name ?? errors?.name,
    birthDate: localErrors.birthDate ?? errors?.birthDate,
    gender: localErrors.gender ?? errors?.gender,
    city: localErrors.city ?? errors?.city,
    wantToLearn: localErrors.wantToLearn ?? errors?.wantToLearn,
  };

  // Можно ли перейти дальше?
  const canProceed = !Object.values(finalErrors).some(error => error);

  const handleNameChange = (value: string) => {
    onChange({ ...data, name: value });

    setLocalErrors(prev => ({
      ...prev,
      name: undefined
    }));
  };

  const handleBirthDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      onChange({ ...data, birthDate: formattedDate });
    } else {
      onChange({ ...data, birthDate: undefined });
    }
    
    setLocalErrors(prev => ({
      ...prev,
      birthDate: undefined
    }));    
  };

  const birthDateValue = data.birthDate ? new Date(data.birthDate + 'T00:00:00') : null;

  const handleGenderChange = (value: string) => {
    onChange({ ...data, gender: value });

    setLocalErrors(prev => ({
      ...prev,
      gender: undefined
    }));    

  };

  const handleCityChange = (value: string, id: number) => {
    onChange({
      ...data,
      city: value,
      idCity: id,
    });

    setLocalErrors(prev => ({
      ...prev,
      city: undefined
    }));     
  };

  const handleCategoryChange = (ids: number[]) => {
    setSelectedCategories(ids);
    setSelectedSubcategories([]);
    const filteredSkills = (data.wantToLearn || []).filter((skill) =>
      ids.includes(skill.categoryId)
    );
    onChange({ ...data, wantToLearn: filteredSkills });

    setLocalErrors(prev => ({
      ...prev,
      wantToLearn: undefined
    }));
  };

  const handleSubcategoryChange = (subcategoryIds: number[]) => {
    setSelectedSubcategories(subcategoryIds);
    if (selectedCategories.length === 0) {
      onChange({ ...data, wantToLearn: [] });
      return;
    }
    const newSkills: SkillSelection[] = subcategoryIds.map((subcatId) => ({
      name: '',
      categoryId: selectedCategories[0],
      subcategoryId: subcatId,
    }));
    onChange({ ...data, wantToLearn: newSkills });

    setLocalErrors(prev => ({
      ...prev,
      wantToLearn: undefined
    }));
  };

  const handleNextClick = () => {
    // Полная валидация всех полей
    const nameError = validateField('name', data.name);
    const birthDateError = validateField('birthDate', data.birthDate);
    const genderError = validateField('gender', data.gender);
    const cityError = validateField('city', data.city);
    const wantToLearnError = validateField('wantToLearn', data.wantToLearn);

    // Обновляем локальные ошибки
    setLocalErrors({
      name: nameError,
      birthDate: birthDateError,
      gender: genderError,
      city: cityError,
      wantToLearn: wantToLearnError,
    });

    // Проверяем, есть ли ошибки
    const hasErrors = !!(nameError || birthDateError || genderError || cityError || wantToLearnError);


    if (!hasErrors && onNext) {
      onNext();
    }
  };

  return (
    <div className={styles.registrationForm}>
      <div className={styles.avatarWrapper}>
        <Avatar
          src={data.avatarBase64 ?? avatarSrc}
          alt={data.name || 'Пользователь'}
          className={styles.avatarImage}
          loading='lazy'
          decoding='async'
        />
      </div>

      <div className={styles.inputGroup}>
        <TextInput
          type='text'
          label='Имя'
          placeholder='Введите ваше имя'
          value={data.name || ''}
          onChange={handleNameChange}
          onBlur={() => onBlur?.('name')}
          error={finalErrors.name}
        />
      </div>

      <div className={styles.fieldsRow}>
        <div className={styles.inputGroup}>
          <Datepicker
            onChange={handleBirthDateChange}
            onBlur={() => onBlur?.('birthDate')}
            placeholder='дд.мм.гггг'
            label='Дата рождения'
            value={birthDateValue}
            error={finalErrors.birthDate}
          />
        </div>
        <div className={styles.inputGroup}>
          <Dropdown
            label='Пол'
            value={data.gender || ''}
            onChange={handleGenderChange}
            onBlur={() => onBlur?.('gender')}
            placeholder='Не указан'
            error={finalErrors.gender}
            optionsFromJSON='gender'
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <Dropdown
          label='Город'
          placeholder='Не указан'
          value={data.city || ''}
          onChange={(value) => handleCityChange(value, 0)}
          onBlur={() => onBlur?.('city')}
          error={finalErrors.city}
          optionsFromJSON='city'
        />
      </div>

      <div className={styles.skillsSection}>
        <Multiselect
          label='Категория навыка'
          placeholder='Выберите категорию'
          selectedIds={selectedCategories}
          onSelectionChange={handleCategoryChange}
          categoriesUrl='/db/category.json'
        />

        <Multiselect
          label='Подкатегория навыка'
          placeholder={
            selectedCategories.length > 0
              ? 'Выберите подкатегорию'
              : 'Сначала выберите категорию'
          }
          selectedIds={selectedSubcategories}
          onSelectionChange={handleSubcategoryChange}
          subcategoriesUrl='/db/subcategories.json'
          categoryId={
            selectedCategories.length > 0 ? selectedCategories[0] : undefined
          }
          disabled={selectedCategories.length === 0}
        />
      </div>

      {finalErrors.wantToLearn && (
        <span className={styles.errorMessage}>{finalErrors.wantToLearn}</span>
      )}

      {(onBack || onNext) && (
        <div className={styles.buttonContainer}>
          <Button
            variant={'secondary'}
            children='Назад'
            size='content'
            onClick={onBack}
            disabled={!onBack}
            className={styles.backButton}
          />

          <Button
            variant={'primary'}
            children='Продолжить'
            size='content'
            onClick={handleNextClick}
            disabled={!canProceed || !onNext}
            className={styles.nextButton}
          />
        </div>
      )}
    </div>
  );
};

export { CardTwoStepRegistration };
export default CardTwoStepRegistration;
