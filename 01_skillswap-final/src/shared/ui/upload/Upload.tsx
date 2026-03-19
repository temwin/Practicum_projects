import React, { useState, useCallback, useRef, type ChangeEvent } from 'react';
import styles from './Upload.module.scss';
import { Icon } from '../icons';

export type UploadMode = 'image' | 'file';

export interface UploadProps {
  mode: UploadMode;
  onChange?: (file: File | null) => void;
  accept?: string; // например, "image/*" или ".pdf,.doc"
  disabled?: boolean;
  className?: string;
}

const Upload: React.FC<UploadProps> = ({
  mode,
  onChange,
  accept,
  disabled = false,
  className = '',
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (selectedFile: File | null) => {
      if (disabled) return;

      setFile(selectedFile);
      onChange?.(selectedFile);
    },
    [disabled, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;

      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) {
        handleFile(droppedFile);
      }
    },
    [disabled, handleFile]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFile(selectedFile);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderContent = () => {
    if (file) {
      if (mode === 'image') {
        return (
          <div className={styles.previewWrapper}>
            <img
              src={URL.createObjectURL(file)}
              alt='Preview'
              className={styles.imagePreview}
              onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
              loading='lazy'
              decoding='async'
            />
            <button
              type='button'
              className={styles.removeButton}
              onClick={handleRemove}
              aria-label='Удалить файл'
            >
              <Icon name='cross' />
            </button>
          </div>
        );
      } else {
        return (
          <div className={styles.fileInfo}>
            <span className={styles.fileName}>{file.name}</span>
            <button
              type='button'
              className={styles.removeButton}
              onClick={handleRemove}
              aria-label='Удалить файл'
            >
              <Icon name='cross' />
            </button>
          </div>
        );
      }
    }

    return (
      <div className={styles.placeholder}>
        <div className={styles.text}>Перетащите или выберите изображения навыка</div>
        <div className={styles.link}>
          <Icon name='galleryAdd' />
          Выбрать изображения
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.upload} ${className}`}>
      <div
        className={`${styles.dropArea} ${isDragging ? styles.dragging : ''} ${file ? styles.withFile : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {renderContent()}
      </div>

      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: 'none' }}
        disabled={disabled}
      />
    </div>
  );
};

export { Upload };
export default Upload;
