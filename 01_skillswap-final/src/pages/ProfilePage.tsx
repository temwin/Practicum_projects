import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProfilePageUI } from './ProfilePage/ProfilePageUI';
import type { User } from '../api/types';

import { useAppDispatch, useAppSelector } from '../app/providers/store';
import { useGlobalSearch } from '../shared/lib/hooks/useGlobalSearch';
import {
  logout,
  selectAuthChecked,
  selectCurrentUserId,
  selectIsAuthenticated,
} from '../features/auth';
import { getUsersThunk } from '../entities/user/model';
import { selectAllUsers, selectUsersLoading } from '../entities/user/model/selectors';
import { updateUser } from '../entities/user/model/userSlice';

const headerOnCompactActionClick = () => {};

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { handleSearchChange } = useGlobalSearch();

  const authChecked = useAppSelector(selectAuthChecked);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const users = useAppSelector(selectAllUsers);
  const usersLoading = useAppSelector(selectUsersLoading);
  const [usersFetched, setUsersFetched] = useState(false);

  const userData = useMemo(() => {
    if (!currentUserId || usersLoading) return null;
    return users.find((u) => u.id === currentUserId) ?? null;
  }, [users, currentUserId, usersLoading]);

  const error = useMemo(() => {
    if (!currentUserId || usersLoading) return null;
    return userData ? null : 'Пользователь не найден';
  }, [currentUserId, userData, usersLoading]);

  const handleSaveProfile = useCallback(
    (updatedUser: Partial<User> & { newPassword?: string }) => {
      if (!currentUserId) return;

      dispatch(
        updateUser({
          id: currentUserId,
          changes: {
            ...updatedUser,
          },
        })
      );
    },
    [currentUserId, dispatch]
  );

  const headerOnLogout = useCallback(() => {
    dispatch(logout());
    navigate('/');
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!authChecked || !isAuthenticated) return;

    if (users.length === 0 && !usersLoading && !usersFetched) {
      dispatch(getUsersThunk());
      setUsersFetched(true);
    }
  }, [authChecked, isAuthenticated, dispatch, users.length, usersLoading, usersFetched]);

  return (
    <ProfilePageUI
      headerOnSearchChange={handleSearchChange}
      headerOnCompactActionClick={headerOnCompactActionClick}
      headerOnLogout={headerOnLogout}
      userData={userData}
      isLoading={usersLoading}
      error={error}
      onSaveProfile={handleSaveProfile}
    />
  );
};

export default ProfilePage;
