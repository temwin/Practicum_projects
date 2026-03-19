import React, { useState } from 'react';
import { getCities } from '../../../api';
import PersonalData from '../PersonalData';
import { useForm } from '../../../shared/lib/hooks/useForm';
import { personalDataValidation } from '../../../shared/lib/validation/login';
import { useAppDispatch, useAppSelector } from '../../../app/providers/store';
import { selectCurrentUser } from '../../../entities/user/model/selectors';
import { updateUser } from '../../../entities/user/model';
import { setCurrentUser } from '../../../entities/user/model/userSlice';

const mapGender = (g: unknown) => {
  const s = String(g ?? '').toLowerCase();
  if (s.includes('женский')) return 'female';
  if (s.includes('мужской')) return 'male';
  return s;
};

export const PersonalDataContainer = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
  };

  const handleAvatarSelect = async (file?: File) => {
    if (!file || !user) return;

    if (!isImageFile(file)) {
      alert('Пожалуйста, выберите файл изображения (JPEG, PNG, GIF и т.д.)');
      return;
    }

    const maxSizeMB = 2;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`Размер файла не должен превышать ${maxSizeMB}MB`);
      return;
    }

    try {
      const base64String = await fileToBase64(file);
      setTempAvatar(base64String); 
      console.log('Аватар выбран и готов к сохранению');
    } catch (error) {
      console.error('Ошибка при обработке файла:', error);
      alert('Не удалось загрузить изображение');
    }
  };

  const { values, handleChange, setValues } = useForm(
    {
      name: '',
      email: '',
      about: '',
      city: '',
      gender: '',
      date: null as Date | null,
    },
    personalDataValidation
  );

  const [cities, setCities] = React.useState<{ value: string; label: string }[]>([]);

  React.useEffect(() => {
    getCities().then((list) => {
      setCities(list.map((c) => ({ value: String(c.id), label: c.name })));
    });
  }, []);

  React.useEffect(() => {
    if (!user) return;

    const cityId = typeof user.location === 'number' ? user.location : user.location?.id;

    setValues({
      name: user.name ?? '',
      email: user.email ?? '',
      about: user.about ?? '',
      city: cityId ? String(cityId) : '',
      gender: mapGender(user.gender),
      date: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
    });
    setTempAvatar(null);
  }, [user, setValues]);

  const handleSave = (password?: string) => {
    if (!user) return;

    const selectedCity = cities.find((c) => c.value === values.city);

    const updatedUserPayload = {
      id: user.id,
      changes: {
        name: values.name,
        email: values.email,
        about: values.about,
        gender: values.gender,
        dateOfBirth: values.date ? values.date.toISOString().split('T')[0] : undefined,
        location: selectedCity
          ? { id: Number(selectedCity.value), name: selectedCity.label }
          : user.location,
        ...(password ? { password } : {}),
        ...(tempAvatar ? { avatarUrl: tempAvatar } : {}),
      },
    };

    dispatch(updateUser(updatedUserPayload));

    if (tempAvatar) {
      const updatedUser = {
        ...user,
        avatarUrl: tempAvatar,
        name: values.name,
        email: values.email,
        about: values.about,
        gender: values.gender,
        dateOfBirth: values.date ? values.date.toISOString().split('T')[0] : user.dateOfBirth,
        location: selectedCity
          ? { id: Number(selectedCity.value), name: selectedCity.label }
          : user.location,
      };
      dispatch(setCurrentUser(updatedUser));
    }

    setTempAvatar(null); 
    alert('Данные успешно сохранены!');
  };

  if (!user) return <div>Загрузка...</div>;
  const currentAvatar = tempAvatar || user.avatarUrl || '';

  return (
    <PersonalData
      emailValue={values.email}
      emailOnChange={(v) => handleChange('email', v)}
      nameValue={values.name}
      nameOnChange={(v) => handleChange('name', v)}
      dateValue={values.date}
      dateOnChange={(d) => handleChange('date', d)}
      genderValue={values.gender}
      genderOnChange={(v) => handleChange('gender', v)}
      cityValue={values.city}
      cities={cities}
      cityOnChange={(v) => handleChange('city', v)}
      aboutValue={values.about}
      aboutOnChange={(v) => handleChange('about', v)}
      saveOnClick={handleSave}
      foto={currentAvatar}
      iconOnClick={handleAvatarSelect}
      saveDisabled={false}
      errors={{}}
    />
  );
};
