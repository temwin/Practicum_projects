import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoginPageView, type LoginErrors, type LoginFormData } from './login/LoginPageView';
import { useAppDispatch, useAppSelector } from '../app/providers/store';
import {
  clearAuthError,
  clearRedirect,
  loginThunk,
  selectAuthError,
  selectAuthRedirectTo,
  selectIsAuthenticated,
} from '../features/auth';
import { selectUsersLoading } from '../entities/user/model';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FromLocation = {
  pathname?: string;
  search?: string;
  hash?: string;
};

type LocationState = {
  from?: FromLocation;
};

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isUsersLoading = useAppSelector(selectUsersLoading);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authError = useAppSelector(selectAuthError);
  const authRedirectTo = useAppSelector(selectAuthRedirectTo);

  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});

  useEffect(() => {
    if (!isAuthenticated) return;

    const state = (location.state ?? null) as LocationState | null;
    const fromState = state?.from;

    const fallback = '/';
    const from =
      (fromState?.pathname ?? '') + (fromState?.search ?? '') + (fromState?.hash ?? '') || fallback;

    navigate(from, { replace: true });
  }, [isAuthenticated, location.state, navigate]);

  useEffect(() => {
    if (!authRedirectTo) return;

    navigate(authRedirectTo, { replace: true });
    dispatch(clearRedirect());
  }, [authRedirectTo, dispatch, navigate]);

  const handleChange = (data: LoginFormData) => {
    setFormData((prev) => ({ ...prev, ...data }));

    if (Object.keys(errors).length) setErrors({});
    if (authError) dispatch(clearAuthError());
  };

  const handleSubmit = async () => {
    const nextErrors: LoginErrors = {};

    const email = (formData.email ?? '').trim();
    const password = formData.password ?? '';

    if (!email) nextErrors.email = 'Введите email';
    else if (!EMAIL_RE.test(email)) nextErrors.email = 'Некорректный email';

    if (!password) nextErrors.password = 'Введите пароль';

    if (isUsersLoading) {
      nextErrors.common =
        'Данные пользователей ещё загружаются, попробуйте снова через пару секунд';
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const state = (location.state ?? null) as LocationState | null;
    const fromState = state?.from;

    const redirectTo =
      (fromState?.pathname ?? '') + (fromState?.search ?? '') + (fromState?.hash ?? '') || '/';

    try {
      await dispatch(loginThunk({ email, password, redirectTo })).unwrap();
    } catch {}
  };

  return (
    <LoginPageView
      formData={formData}
      errors={{ ...errors, common: errors.common || authError || undefined }}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onRegisterClick={() => navigate('/register')}
      onLogoClick={() => navigate('/')}
      onClose={() => navigate(-1)}
    />
  );
};

export default LoginPage;
