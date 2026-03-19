import React from 'react';
import { useNavigate } from 'react-router-dom';
import error404Img from '../../shared/assets/error404.png';
import error500Img from '../../shared/assets/error500.png';
import styles from './ErrorPage.module.scss';
import { Button } from '../../shared/ui/button';

export type ErrorType = 404 | 500;

export interface ErrorPageProps {
  errorType: ErrorType;
  onRetry?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorType, onRetry }) => {
  const navigate = useNavigate();

  const config = {
    404: {
      image: error404Img,
      title: 'Страница не найдена',
      message:
        'К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже',
    },
    500: {
      image: error500Img,
      title: 'На сервере произошла ошибка',
      message: 'Попробуйте позже или вернитесь на главную страницу',
    },
  }[errorType];

  return (
    <div className={styles.container}>
      <img src={config.image} alt='' className={styles.image} />
      <div className={styles.textContainer}>
        <h1 className={styles.title}>{config.title}</h1>
        <p className={styles.message}>{config.message}</p>
      </div>
      <div className={styles.actions}>
        <Button variant='secondary' size='content' onClick={onRetry}>
          Сообщить об ошибке
        </Button>
        <Button variant='primary' size='content' onClick={() => navigate('/')}>
          На главную
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
