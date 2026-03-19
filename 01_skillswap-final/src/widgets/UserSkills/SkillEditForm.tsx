import React, { useState } from 'react';
import { TextInput } from '../../shared/ui/textinput';
import { TextArea } from '../../shared/ui/textarea';
import { Dropdown } from '../../shared/ui/dropdown';
import { Button } from '../../shared/ui/button';
import { Upload } from '../../shared/ui/upload';
import type { Category, Subcategory } from '../../api/types';
import type { SkillFormData } from './UserSkills';
import styles from './UserSkills.module.scss';

interface SkillEditFormProps {
  initialData?: SkillFormData;
  onSubmit: (data: SkillFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
  errors?: { canTeach?: string };
}

export const SkillEditForm: React.FC<SkillEditFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isEditing = false,
  errors = {},
}) => {
  const [formData, setFormData] = useState<SkillFormData>(initialData);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialData.category?.id?.toString() || ''
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>(
    initialData.subcategory?.id?.toString() || ''
  );

  // Обработчик изменения данных формы
  const handleChange = (updates: Partial<SkillFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Обработчик изменения категории
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);

    // При изменении категории сбрасываем подкатегорию
    setSelectedSubcategoryId('');

    // Здесь можно было бы загрузить подкатегории для выбранной категории
    // но пока просто сохраняем ID категории
    const category: Category = {
      id: Number(categoryId),
      name: '', // Имя будет подгружено из данных
    };

    handleChange({
      category,
      subcategory: null, // Сбрасываем подкатегорию
    });
  };

  // Обработчик изменения подкатегории
  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategoryId(subcategoryId);

    const subcategory: Subcategory = {
      id: Number(subcategoryId),
      name: '', // Имя будет подгружено из данных
      categoryId: Number(selectedCategoryId),
    };

    handleChange({ subcategory });
  };

  // Обработчик загрузки изображения
  const handleUploadChange = (file: File | null) => {
    if (!file) {
      handleChange({
        image: undefined,
        imagesBase64: undefined,
      });
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    // Конвертация в base64
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
        handleChange({
          image: imageUrl,
          imagesBase64: base64,
        });
      })
      .catch((err) => {
        console.error('Ошибка при конвертации файла:', err);
        handleChange({
          image: imageUrl,
          imagesBase64: undefined,
        });
      });
  };

  // Обработчик отправки формы
  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className={styles.skillEditForm}>
      <div className={styles.formSection}>
        <TextInput
          label='Название навыка'
          placeholder='Введите название вашего навыка'
          value={formData.skillName || ''}
          onChange={(value) => handleChange({ skillName: value })}
          error={errors.canTeach && !formData.skillName?.trim() ? errors.canTeach : undefined}
        />
      </div>

      <div className={styles.formSection}>
        <Dropdown
          label='Категория навыка'
          placeholder='Выберите категорию'
          optionsFromJSON='category'
          value={selectedCategoryId}
          onChange={handleCategoryChange}
        />
      </div>

      <div className={styles.formSection}>
        <Dropdown
          label='Подкатегория навыка'
          placeholder={selectedCategoryId ? 'Выберите подкатегорию' : 'Сначала выберите категорию'}
          optionsFromJSON='subcategory'
          optionsFromJSONFilterId={selectedCategoryId ? Number(selectedCategoryId) : undefined}
          value={selectedSubcategoryId}
          onChange={handleSubcategoryChange}
          disabled={!selectedCategoryId}
        />
      </div>

      <div className={styles.formSection}>
        <TextArea
          label='Описание'
          placeholder='Опишите ваш навык подробнее...'
          value={formData.description || ''}
          onChange={(value) => handleChange({ description: value })}
          error={errors.canTeach && !formData.description?.trim() ? errors.canTeach : undefined}
        />
      </div>

      <div className={styles.formSection}>
        <div className={styles.uploadLabel}>Изображение навыка</div>
        <Upload mode='image' onChange={handleUploadChange} />
        <div className={styles.uploadHint}>
          Загрузите изображение, которое лучше всего описывает ваш навык
        </div>
      </div>

      {errors.canTeach && <div className={styles.formError}>{errors.canTeach}</div>}

      <div className={styles.formActions}>
        <Button variant='primary' onClick={handleSubmit}>
          {isEditing ? 'Сохранить изменения' : 'Создать навык'}
        </Button>
        <Button variant='tertiary' onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </div>
  );
};
