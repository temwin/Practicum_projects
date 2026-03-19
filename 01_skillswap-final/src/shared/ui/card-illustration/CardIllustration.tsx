import React from 'react';
import { Text } from '../text';
import styles from './CardIllustration.module.css';

/**
 * Интерфейс свойств компонента CardIllustration
 */
export interface CardIllustrationProps {
  /**
   * Данные об изображении
   * @property {string} src - URL изображения
   * @property {string} alt - Текстовое описание для доступности
   * @property {number} [width] - Ширина изображения (опционально)
   * @property {number} [height] - Высота изображения (опционально)
   */
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };

  /**
   * Заголовок карточки
   * @type {string}
   */
  title: string;

  /**
   * Описание карточки
   * @type {string}
   */
  description: string;

  /**
   * Выравнивание контента
   * @default 'center'
   * @type {'left' | 'right' | 'center'}
   */
  align?: 'left' | 'right' | 'center';

  /**
   * Интервалы между элементами
   * @default 'normal'
   * @type {'normal' | 'compact'}
   */
  spacing?: 'normal' | 'compact';

  /**
   * Дополнительные CSS-классы для корневого элемента
   * @type {string}
   * @default ''
   */
  className?: string;
}

/**
 * Компонент карточки с иллюстрацией, заголовком и описанием
 *
 * @param {CardIllustrationProps} props - Свойства компонента
 * @returns {JSX.Element} Отрендеренная карточка
 */
export const CardIllustration: React.FC<CardIllustrationProps> = ({
  image,
  title,
  description,
  align = 'center',
  spacing = 'normal',
  className = '',
}) => {
  // Формируем итоговый набор классов для контейнера
  // Объединяем стили по умолчанию, выравнивание, интервалы и пользовательские классы
  const containerClasses = [styles.container, styles[align], styles[spacing], className]
    .filter(Boolean) // Удаляем пустые значения
    .join(' '); // Объединяем в строку через пробел

  return (
    <div className={containerClasses}>
      {/* Контейнер для изображения */}
      <div className={styles.imageWrapper}>
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className={styles.image}
          loading='lazy' // Отложенная загрузка изображения
          decoding='async'
        />
      </div>

      {/* Контейнер для текстового контента */}
      <div className={styles.content}>
        {/* Заголовок карточки */}
        <Text variant={'h2'} className={styles.title}>
          {title}
        </Text>

        {/* Описание карточки */}
        <Text variant={'body'} className={styles.description}>
          {description}
        </Text>
      </div>
    </div>
  );
};
