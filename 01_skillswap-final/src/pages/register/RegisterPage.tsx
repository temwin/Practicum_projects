import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/providers/store';
import RegistrationWizard from '../../widgets/RegistrationWizard/RegistrationWizard';
import type { RegistrationData } from '../../widgets/RegistrationWizard/RegistrationWizard';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';

import { addUser, clearUsersError } from '../../entities/user/model';
import type { City, Skill, Subcategory } from '../../api/types';
import { RegistrationStep3Modal } from '../modals/RegistrationStep3Modal';
import { loginThunk } from '../../features/auth/authSlice';
import type { SkillType } from '../../widgets/SkillDescription/SkillDescription';
import { selectCategoryById } from '../../entities/category/model/selectors';
import { selectSubcategoryById } from '../../entities/subcategory/model/selectors';
import { selectCityById } from '../../entities/city/model/selectors';
import store from '../../app/providers/store';

export interface RegisterPageProps {
  onLogoClick?: () => void;
  onClose?: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onLogoClick, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);  

  const error = useAppSelector((state) => state.users.error);

  const handleLogoClick = onLogoClick || (() => navigate('/'));
  const handleClose = onClose || (() => navigate('/'));

  const handleRegistrationSubmit = (data: RegistrationData) => {
    setRegistrationData(data);

    const cityId = parseInt(data.city ?? '', 10);

    // Получаем город из стора для данной реализации api 
    const state = store.getState(); 
    const foundCity = selectCityById(state, cityId);
    if (!foundCity) {
      console.log('Город не найден');      
    }

    const customSkillId = Date.now(); 

    const newUserPayload = {
      profile: {
        avatarUrl: data.avatarBase64 || '',
        name: data.name || '',
        dateOfBirth: data.birthDate || '',
        age: '',
        gender: data.gender || '',
        location: {
          id: cityId,
          name: foundCity?.name || 'Город не выбран',
        } as City,
        email: data.email || '',
        password: data.password || '',
        about: data.description || '',
        greeting: '',
        skillCanTeach: {
          id: customSkillId,
          subcategoryId: data.subcategoryId || 0,
          name: data.skillName || '',
          description: data.description || '',
        } as Skill,
        images: data.imagesBase64 ? [data.imagesBase64] : [],
        subcategoriesWantToLearn: (data.wantToLearn || []).map((item) => ({
          id: item.subcategoryId,
          name: item.name || '', // Это поле всегда пустое
          categoryId: item.categoryId || 0,
        })) as Subcategory[],
        liked: 0,
        likedUserIds: [],
      },
      email: data.email || '',
      password: data.password || '',
    };
console.log('newUserPayload=', newUserPayload);
    dispatch(addUser(newUserPayload));

    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  const handleModalConfirm = async () => {
    setIsModalOpen(false);

    if (!registrationData) {
      navigate('/');
      return;
    }

    const email = registrationData.email;
    const password = registrationData.password;

    if (!email || !password) {
      navigate('/login');
      return;
    }

    try {
      const result = await dispatch(
        loginThunk({
          email,
          password,
          redirectTo: '/',
        })
      ).unwrap();

      navigate(result.redirectTo);
    } catch (e) {
      navigate('/login');
    }
  };

  const handleModalEdit = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (error) {
      dispatch(clearUsersError());
    }
  }, [error, dispatch]);

  // Получаем имя категории по ID из registrationData
  const category = useAppSelector(
    selectCategoryById(registrationData?.categoryId ?? -1)
  );
  
  // Получаем имя подкатегории по ID из registrationData
  const subcategory = useAppSelector(
    selectSubcategoryById(registrationData?.subcategoryId ?? -1)
  );

  const skill: SkillType = {
    id: 0,
    userId: 0,
    name: registrationData?.skillName ?? '',
    description: registrationData?.description ?? '',
    images: registrationData?.imagesBase64 ? [registrationData.imagesBase64] : [],
    category: category?.name ?? '',
    subcategory: subcategory?.name ?? '',
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.content}>
        <RegistrationWizard
          onLogoClick={handleLogoClick}
          onClose={handleClose}
          onSubmit={handleRegistrationSubmit}
        />
      </div>

      {error && <div className={styles.errorMessage}>Ошибка: {error}</div>}

      <RegistrationStep3Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        onEdit={handleModalEdit}
        skill={skill}
      />
    </div>
  );
};

export default RegisterPage;
