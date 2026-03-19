import type { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from './store';
import { selectIsAuthenticated, selectAuthChecked } from '../../features/auth';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children?: ReactElement;
}

export const ProtectedRoute = ({ onlyUnAuth = false, children }: ProtectedRouteProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authChecked = useAppSelector(selectAuthChecked);
  const location = useLocation();

  // Ждем, пока проверка аутентификации не будет завершена
  if (!authChecked) {
    return <div>Загрузка...</div>; // или <Loader />
  }

  // Если только для неавторизованных И пользователь авторизован
  if (onlyUnAuth && isAuthenticated) {
    const redirect = location.state?.from || { pathname: '/' };
    return <Navigate to={redirect} replace />;
  }

  // Если требуется авторизация И пользователь не авторизован
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
