import React from 'react';
import styles from './StepsIndicator.module.css';

/**
 * Пропсы для индикатора шагов
 * @prop {number} [totalSteps=3] - Общее число шагов в индикаторе
 * @prop {number} current - Номер текущего шага (от 1 до totalSteps)
 * @prop {string} [customClass] - Дополнительные классы для стилизации
 * @prop {string} [activeFill] - Цвет заполненных шагов
 * @prop {string} [inactiveFill] - Цвет незаполненных шагов
 */
interface StepsProps {
  totalSteps?: number;
  current: number;
  customClass?: string;
  activeFill?: string;
  inactiveFill?: string;
}

/**
 * Визуальный индикатор прогресса по шагам
 * Отображает горизонтальную шкалу с заполненными/незаполненными шагами
 * и текстовую подпись вида "Шаг X из Y"
 */
const StepsIndicator: React.FC<StepsProps> = ({
  totalSteps = 3,
  current,
  customClass = '',
  activeFill,
  inactiveFill,
}) => {
  // Генерируем массив номеров шагов
  const stepNumbers = Array.from({ length: totalSteps }, (_, idx) => idx + 1);

  // Нормализуем текущий шаг: min=1, max=totalSteps
  const normalizedStep = Math.max(1, Math.min(current, totalSteps));

  // CSS-переменные для кастомных цветов
  const styleProps: React.CSSProperties & { [key: string]: string } = {
    '--progress-fill-active': activeFill || '',
    '--progress-fill-inactive': inactiveFill || '',
  };

  return (
    <div className={`${styles.rootWrapper} ${customClass}`} style={styleProps}>
      {/* Текстовая метка текущего прогресса */}
      <div className={styles.stepLabel}>
        Шаг {normalizedStep} из {totalSteps}
      </div>

      {/* Контейнер со шкалой шагов */}
      <div
        className={styles.progressContainer}
        role='progressbar'
        aria-label={`Текущий шаг ${normalizedStep} из ${totalSteps}`}
        aria-valuenow={normalizedStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
      >
        {stepNumbers.map((num) => (
          <div
            key={num}
            className={`
              ${styles.stepIndicator}
              ${num <= normalizedStep ? styles.isActive : ''}
            `}
            aria-current={num === normalizedStep ? 'step' : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default StepsIndicator;
