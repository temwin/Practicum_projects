import React, { useState, useMemo } from 'react';
import styles from './ImageSlider.module.css';

interface ImageSliderProps {
  images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleThumbnailClick = (index: number) => {
    if (index < images.length) {
      setCurrentIndex(index);
    }
  };

  // Получаем до 3 изображений, начиная с currentIndex
  const visibleThumbs = useMemo(() => {
    const start = currentIndex + 1;
    return images.slice(start, start + 2);
  }, [currentIndex, images]);

  // Сколько изображений осталось после текущей группы из 3
  const remainingCount = Math.max(0, images.length - (currentIndex + 3));
  const showMore = remainingCount > 0;

  const handleShowMoreClick = () => {
    const nextIndex = currentIndex + 3;
    if (nextIndex < images.length) {
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <div className={styles.sliderContainer}>
      {/* Основное изображение */}
      <div className={styles.mainSlider}>
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className={styles.mainImage}
          loading='lazy'
          decoding='async'
        />
        <button className={`${styles.navBtn} ${styles.prev}`} onClick={handlePrev}>
          &lt;
        </button>
        <button className={`${styles.navBtn} ${styles.next}`} onClick={handleNext}>
          &gt;
        </button>
      </div>

      {/* Миниатюры — всегда до 3 элементов */}
      <div className={styles.thumbnails}>
        {visibleThumbs.map((img: string, offset: number) => {
          const actualIndex = currentIndex + 1 + offset;
          return (
            <div
              key={actualIndex}
              className={`${styles.thumbItem} ${actualIndex === currentIndex ? styles.active : ''}`}
              onClick={() => handleThumbnailClick(actualIndex)}
            >
              <img src={img} alt={`Thumb ${actualIndex + 1}`} loading='lazy' decoding='async' />
            </div>
          );
        })}

        {/* Заполняем пустые места, если visibleThumbs < 2 */}
        {Array.from({ length: 2 - visibleThumbs.length }).map((_, i) => (
          <div key={`empty-${i}`} className={styles.thumbItem} style={{ visibility: 'hidden' }} />
        ))}

        {/* 3-я миниатюра: всегда присутствует, если есть хоть одна скрытая */}
        {showMore ? (
          <div className={`${styles.thumbItem} ${styles.more}`} onClick={handleShowMoreClick}>
            <img
              src={images[currentIndex + 3]}
              alt={`Thumb ${currentIndex + 4}`}
              loading='lazy'
              decoding='async'
            />
            <span className={styles.moreText}>+{remainingCount}</span>
          </div>
        ) : images.length > currentIndex + 3 ? (
          <div
            key={currentIndex + 3}
            className={`${styles.thumbItem} ${
              currentIndex + 3 === currentIndex ? styles.active : ''
            }`}
            onClick={() => handleThumbnailClick(currentIndex + 3)}
          >
            <img
              src={images[currentIndex + 3]}
              alt={`Thumb ${currentIndex + 4}`}
              loading='lazy'
              decoding='async'
            />
          </div>
        ) : (
          <div className={styles.thumbItem} style={{ visibility: 'hidden' }} />
        )}
      </div>
    </div>
  );
};

export default ImageSlider;
