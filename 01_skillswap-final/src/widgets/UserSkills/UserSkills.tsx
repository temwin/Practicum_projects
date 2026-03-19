import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../shared/ui/button';
import styles from './UserSkills.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/providers/store';
import { updateUser } from '../../entities/user/model';
import { SkillEditForm } from './SkillEditForm';
import type { Skill, Category, Subcategory } from '../../api/types';
import { useCategoryTag } from '../../shared/lib/hooks/useCategoryTag';
import { Tag } from '../../shared/ui/tag';

export interface SkillFormData {
  skillName?: string;
  category?: Category | null;
  subcategory?: Subcategory | null;
  description?: string;
  image?: string;
  imagesBase64?: string;
}

const UserSkills = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{ canTeach?: string }>({});
  const getTagType = useCategoryTag();

  const currentUserId = useSelector((state: RootState) => state.auth.currentUserId);
  const currentUser = useSelector((state: RootState) =>
    state.users.users.find((u) => u.id === currentUserId)
  );

  if (!currentUser) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔒</div>
          <h3>Необходима авторизация</h3>
          <p>Войдите в систему, чтобы управлять своими навыками</p>
          <Button variant='primary' onClick={() => navigate('/login')}>
            Войти
          </Button>
        </div>
      </div>
    );
  }

  const hasSkill = !!currentUser.skillCanTeach;
  const currentSkill = currentUser.skillCanTeach;

  const initialFormData: SkillFormData =
    hasSkill && currentSkill
      ? {
          skillName: currentSkill.name || '',
          description: currentSkill.description || '',
          imagesBase64: currentUser.images?.[0] || '',
          category: currentSkill.category || null,
          subcategory: currentSkill.subcategory || null,
        }
      : {};

  const handleSaveSkill = (formData: SkillFormData) => {
    if (!formData.skillName?.trim()) {
      setErrors({ canTeach: 'Название навыка обязательно' });
      return;
    }
    if (!formData.description?.trim()) {
      setErrors({ canTeach: 'Описание обязательно' });
      return;
    }

    const skillData: Skill = {
      id: currentSkill?.id || Date.now(),
      name: formData.skillName,
      description: formData.description || '',
      subcategoryId: formData.subcategory?.id || 0,
      category: formData.category || undefined,
      subcategory: formData.subcategory || undefined,
    };

    dispatch(
      updateUser({
        id: currentUser.id,
        changes: {
          skillCanTeach: skillData,
          ...(formData.imagesBase64 && { images: [formData.imagesBase64] }),
        },
      })
    );

    setErrors({});
    setIsEditing(false);
  };

  const handleDeleteSkill = () => {
    if (!hasSkill) return;

    if (window.confirm('Удалить навык? Это действие нельзя отменить.')) {
      dispatch(
        updateUser({
          id: currentUser.id,
          changes: { skillCanTeach: undefined },
        })
      );
    }
  };

  if (!hasSkill && !isEditing) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>Мои навыки</h2>
        </header>

        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✨</div>
          <h3>У вас пока нет навыков</h3>
          <p>Создайте навык, чтобы начать делиться знаниями с другими</p>
          <Button variant='primary' onClick={() => setIsEditing(true)}>
            Создать навык
          </Button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>{hasSkill ? 'Редактирование навыка' : 'Создание навыка'}</h2>
          <Button variant='tertiary' onClick={() => setIsEditing(false)}>
            Отмена
          </Button>
        </header>

        <div className={styles.formContainer}>
          <SkillEditForm
            initialData={initialFormData}
            onSubmit={handleSaveSkill}
            onCancel={() => setIsEditing(false)}
            isEditing={hasSkill}
            errors={errors}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Мой навык</h2>
        </div>
        <div className={styles.headerActions}>
          <Button variant='primary' onClick={() => setIsEditing(true)}>
            Редактировать
          </Button>
          <Button variant='secondary' onClick={handleDeleteSkill}>
            Удалить
          </Button>
        </div>
      </header>

      <div className={styles.skillView}>
        <div className={styles.skillCard}>
          <div className={styles.skillHeader}>
            <div>
              <h3 className={styles.skillTitle}>{currentSkill?.name}</h3>
              <p className={styles.skillType}>Я обучаю</p>
            </div>
            <div className={styles.userSkills}>
              {currentSkill && currentSkill.category && (
                <Tag type={getTagType(currentSkill.category.id)} children={currentSkill.name} />
              )}
            </div>
          </div>{' '}
          {currentUser.images && currentUser.images.length > 0 && (
            <div className={styles.imageContainer}>
              <img src={currentUser.images[0]} alt={currentSkill?.name || 'Изображение навыка'} />
            </div>
          )}
          <p className={styles.skillDescription}>{currentSkill?.description || 'Нет описания'}</p>
          <div className={styles.skillFooter}></div>
        </div>
      </div>
    </div>
  );
};

export default UserSkills;
