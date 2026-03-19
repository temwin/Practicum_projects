import React, { useState } from 'react';
import { TextInput } from '../textinput/TextInput';
import { TextArea } from '../textarea';
import { Dropdown } from '../dropdown';
import { Button } from '../button';
import { Upload } from '../upload';
import styles from './CardThreeStepRegistration.module.css';

export interface CardThreeStepRegistrationProps {
  data: {
    skillName?: string;
    categoryId?: number;
    subcategoryId?: number;
    description?: string;
    image?: string;
    imagesBase64?: string;
  };
  errors?: {
    skillName?: string;
    categoryId?: string;
    subcategoryId?: string; 
    description?: string;
    canTeach?: string;
  };
  onChange: (data: Partial<CardThreeStepRegistrationProps['data']>) => void;
  onBlur?: (field: string) => void;
  onBack?: () => void;
  onNext?: () => void;
}

export const CardThreeStepRegistration: React.FC<CardThreeStepRegistrationProps> = ({
  data,
  errors,
  onChange,
  onBlur,
  onBack,
  onNext,
}) => {
  const [localErrors, setLocalErrors] = useState<{
    skillName?: string;
    categoryId?: string;
    subcategoryId?: string;
    description?: string;
  }>({});

  const [selectedCategories, setSelectedCategories] = useState<string>(
    data.categoryId != null ? data.categoryId.toString() : ''
  );

  const [selectedSubcategories, setSelectedSubcategories] = useState<string>(
    data.subcategoryId != null ? data.subcategoryId.toString() : ''
  );

  // Валидация полей
  const validateField = (field: string, value: any): string | undefined => {
    switch (field) {
      case 'skillName':
        return value?.trim() ? undefined : 'Название навыка обязательно';
      case 'categoryId':
        return value ? undefined : 'Категория навыка обязательна';
      case 'subcategoryId':
        return value ? undefined : 'Подкатегория навыка обязательна';
      case 'description':
        return value?.trim() ? undefined : 'Описание обязательно';
      default:
        return undefined;
    }
  };

  // Финальные ошибки (приоритет: localErrors)
  const finalErrors = {
    skillName: localErrors.skillName ?? errors?.skillName,
    categoryId: localErrors.categoryId ?? errors?.categoryId,
    subcategoryId: localErrors.subcategoryId ?? errors?.subcategoryId,
    description: localErrors.description ?? errors?.description,
    canTeach: errors?.canTeach,
  };

  // Можно ли перейти дальше?
  const canProceed = !Object.values(finalErrors).some(error => error);

  const handleSkillNameChange = (value: string) => {
    onChange({ ...data, skillName: value });
    
    setLocalErrors(prev => ({ ...prev, skillName: undefined }));
  };

  const handleDescriptionChange = (value: string) => {
    onChange({ ...data, description: value });
    
    setLocalErrors(prev => ({ ...prev, description: undefined }));
  };

  const handleCategoryChange = (ids: string) => {
    setSelectedCategories(ids);
    const categoryId: number = Number(ids);
    onChange({
      ...data,
      categoryId,
      subcategoryId: undefined, // сбрасываем подкатегорию при смене категорий
    });
    
    setLocalErrors(prev => ({
      ...prev,
      categoryId: undefined,
      subcategoryId: undefined
    }));
  };

  const handleSubcategoryChange = (ids: string) => {
    setSelectedSubcategories(ids);
    const subcategoryId: number = Number(ids);
    onChange({ ...data, subcategoryId });
    
    setLocalErrors(prev => ({
      ...prev,
      categoryId: undefined,
      subcategoryId: undefined
    }));
  };

  const handleUploadChange = (file: File | null) => {
    if (file === null) {
      onChange({
        ...data,
        image: undefined,
        imagesBase64: undefined,
      });
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    };

    fileToBase64(file)
      .then((base64) => {
        onChange({
          ...data,
          image: imageUrl,
          imagesBase64: base64,
        });
      })
      .catch((err) => {
        console.error('Ошибка при конвертации файла в base64:', err);
        onChange({
          ...data,
          image: imageUrl,
          imagesBase64: undefined,
        });
      });
  };

  const handleNextClick = () => {
    // валидация перед переходом
    const skillNameError = validateField('skillName', data.skillName);
    const categoryIdError = validateField('categoryId', data.categoryId);
    const subcategoryIdError = validateField('subcategoryId', data.subcategoryId);
    const descriptionError = validateField('description', data.description);

    setLocalErrors({
      skillName: skillNameError,
      categoryId: categoryIdError,
      subcategoryId: subcategoryIdError,
      description: descriptionError,
    });

    const hasErrors = !!(skillNameError || categoryIdError || subcategoryIdError || descriptionError);

    if (!hasErrors && onNext) {
      onNext();
    }
  };

  return (
    <div className={styles.registrationForm}>
      <div className={styles.inputGroup}>
        <TextInput
          placeholder='Введите название вашего навыка'
          value={data.skillName || ''}
          onChange={handleSkillNameChange}
          onBlur={() => onBlur?.('skillName')}
          type='text'
          label='Название навыка'
          error={finalErrors.skillName}
        />
      </div>

      <div className={styles.inputGroup}>
        <Dropdown
          label='Категория навыка'
          placeholder='Выберите категорию навыка'
          optionsFromJSON='category'
          value={selectedCategories || ''}
          onChange={handleCategoryChange}
          error={finalErrors.categoryId}
        />
      </div>

      <div className={styles.inputGroup}>
        <Dropdown
          label='Подкатегория навыка'
          placeholder={selectedCategories ? 'Выберите подкатегорию' : 'Сначала выберите категорию'}
          optionsFromJSON='subcategory'
          optionsFromJSONFilterId={selectedCategories ? Number(selectedCategories) : undefined}
          value={selectedSubcategories || ''}
          onChange={handleSubcategoryChange}
          disabled={!selectedCategories}
          error={finalErrors.subcategoryId} 
        />
      </div>

      {finalErrors.canTeach && (
        <span className={styles.errorMessage}>{finalErrors.canTeach}</span>
      )}

      <div className={styles.inputGroup}>
        <TextArea
          label='Описание'
          placeholder='Коротко опишите, чему можете научить'
          value={data.description || ''}
          onChange={handleDescriptionChange}
          onBlur={() => onBlur?.('description')}
          error={finalErrors.description}
        />
      </div>

      <div className={styles.inputGroup}>
        <div className={styles.uploadContainer}>
          <Upload mode='image' onChange={handleUploadChange} />
        </div>
      </div>

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

export default CardThreeStepRegistration;
