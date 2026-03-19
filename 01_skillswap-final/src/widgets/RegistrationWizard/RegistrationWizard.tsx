import React, { useState } from 'react';
import { HeaderLogin } from '../../shared/ui/header-login/HeaderLogin';
import StepsIndicator from '../../shared/ui/steps-indicator/StepsIndicator';
import { CardIllustration } from '../../shared/ui/card-illustration/CardIllustration';
import type { CardIllustrationProps } from '../../shared/ui/card-illustration/CardIllustration';
import { CardFirstStepRegistration } from '../../shared/ui/card-first-step-registration/CardFirstStepRegistration';
import { CardTwoStepRegistration } from '../../shared/ui/card-two-step-registration/CardTwoStepRegistration';
import { CardThreeStepRegistration } from '../../shared/ui/card-three-step-registration/CardThreeStepRegistration';
import styles from './RegistrationWizard.module.css';

// Массив конфигураций для иллюстраций на каждом шаге регистрации
// Содержит данные об изображении, заголовке, описании и настройках отображения
const illustrationConfigs: CardIllustrationProps[] = [
  // Шаг 1: приветствие и общее описание платформы
  {
    image: {
      src: '/src/shared/assets/light-bulb.png',
      alt: 'Иллюстрация: идея',
      width: 300,
      height: 300,
    },
    title: 'Добро пожаловать в SkillSwap!',
    description: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
    align: 'center',
    spacing: 'normal',
  },
  // Шаг 2: заполнение личной информации
  {
    image: {
      src: '/src/shared/assets/user info.png',
      alt: 'Иллюстрация: профиль',
      width: 300,
      height: 300,
    },
    title: 'Расскажите немного о себе',
    description: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
    align: 'center',
    spacing: 'normal',
  },
  // Шаг 3: указание навыков для обмена
  {
    image: {
      src: '/src/shared/assets/school-board.png',
      alt: 'Иллюстрация: навык',
      width: 300,
      height: 300,
    },
    title: 'Укажите, чем вы готовы поделиться',
    description: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
    align: 'center',
    spacing: 'normal',
  },
];

// Интерфейс для хранения всех данных формы регистрации (все три шага)
export interface RegistrationData {
  // Данные первого шага (аутентификация)
  email?: string;
  password?: string;

  // Данные второго шага (личная информация)
  name?: string;
  birthDate?: string;
  gender?: string;
  city?: string;
  wantToLearn?: { name: string; categoryId: number; subcategoryId: number }[];
  avatarBase64?: string;

  // Данные третьего шага (навыки)
  skillName?: string;
  categoryId?: number;
  subcategoryId?: number;
  description?: string;
  image?: string;
  imagesBase64?: string;
}

// Интерфейс для ошибок валидации полей формы
export interface RegistrationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  wantToLearn?: string;
  canTeach?: string;
}

interface RegistrationWizardProps {
  onLogoClick: () => void;
  onClose: () => void;
  onSubmit: (data: RegistrationData) => void; // Callback для передачи данных родителю
}

export const RegistrationWizard: React.FC<RegistrationWizardProps> = ({
  onLogoClick,
  onClose,
  onSubmit,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<RegistrationData>({});
  const [errors, setErrors] = useState<RegistrationErrors>({});

  const handleDataChange = (newData: Partial<RegistrationData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: RegistrationErrors = {};

    if (currentStep === 1) {
      if (!data.email) newErrors.email = 'Email обязателен';
      if (!data.password) newErrors.password = 'Пароль обязателен';
    } else if (currentStep === 2) {
      if (!data.name) newErrors.wantToLearn = 'Имя обязательно';
      if (!data.wantToLearn || data.wantToLearn.length === 0) {
        newErrors.wantToLearn = 'Выберите навык, которому хотите научиться';
      }
    } else if (currentStep === 3) {
      if (!data.skillName) newErrors.canTeach = 'Название навыка обязательно';
      if (!data.description) newErrors.canTeach = 'Описание обязательно';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) {
      setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
    }
  };

  const goBack = () => {
    setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));
  };

  const currentIllustration = illustrationConfigs[step - 1];

  return (
    <div className={styles.page}>
      <HeaderLogin onLogoClick={onLogoClick} onClose={onClose} />
      <div className={styles.stepsContainer}>
        <StepsIndicator totalSteps={3} current={step} />
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.formBlock}>
          {step === 1 && (
            <CardFirstStepRegistration
              data={{ email: data.email, password: data.password }}
              errors={errors}
              onChange={(d) => handleDataChange(d)}
              onNext={goNext}
            />
          )}
          {step === 2 && (
            <CardTwoStepRegistration
              data={{
                name: data.name,
                birthDate: data.birthDate,
                gender: data.gender,
                city: data.city,
                wantToLearn: data.wantToLearn,
                avatarBase64: data.avatarBase64,
              }}
              errors={{ wantToLearn: errors.wantToLearn }}
              onChange={(d) => handleDataChange(d)}
              onBack={goBack}
              onNext={goNext}
            />
          )}
          {step === 3 && (
            <CardThreeStepRegistration
              data={{
                skillName: data.skillName,
                categoryId: data.categoryId,
                subcategoryId: data.subcategoryId,
                description: data.description,
                image: data.image,
                imagesBase64: data.imagesBase64,
              }}
              errors={{ canTeach: errors.canTeach }}
              onChange={(d) => handleDataChange(d)}
              onBack={goBack}
              onNext={() => onSubmit(data)}
            />
          )}
        </div>
        <div className={styles.illustrationBlock}>
          <CardIllustration
            image={currentIllustration.image}
            title={currentIllustration.title}
            description={currentIllustration.description}
            align={currentIllustration.align}
            spacing={currentIllustration.spacing}
            className={currentIllustration.className}
          />
        </div>
      </div>
    </div>
  );
};

export default RegistrationWizard;
