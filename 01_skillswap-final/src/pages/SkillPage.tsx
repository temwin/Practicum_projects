import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SkillPageUI } from './SkillPage/SkillPageUI';
import type { User, Skill } from '../api/types';
import { useAppDispatch, useAppSelector } from '../app/providers/store';
import { useGlobalSearch } from '../shared/lib/hooks/useGlobalSearch';

import { selectAllUsers, toggleLike } from '../entities/user/model';
import { selectCurrentUser } from '../entities/user/model/selectors';

import {
  selectSubcategoryById,
  selectSubcategoryIdsByCategoryId,
} from '../entities/subcategory/model/selectors';
import { fetchSubcategories } from '../entities/subcategory/model/subcategorySlice';

import { createRequestAndNotify, selectHasPendingRequest } from '../features/requests';
import { SuccessModal } from './modals/SuccessModal/SuccessModal';

export interface UserWithSkill extends Omit<User, 'skillCanTeach' | 'subcategoriesWantToLearn'> {
  skillCanTeach: Skill;
  location: { id: number; name: string };
  subcategoriesWantToLearn?: { id: number; name: string }[];
}

const SkillPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userIdFromRoute = Number(id);

  // Используем глобальный поиск
  const { searchValue, handleSearchChange } = useGlobalSearch();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const authUser = useAppSelector(selectCurrentUser);
  const allUsers = useAppSelector(selectAllUsers) as unknown as UserWithSkill[];

  const subcategoryState = useAppSelector((state) => state.subcategory);
  useEffect(() => {
    if (!subcategoryState.subcategories.length) {
      dispatch(fetchSubcategories());
    }
  }, [dispatch, subcategoryState.subcategories.length]);

  const ownerData = useMemo<UserWithSkill | null>(() => {
    if (!Number.isFinite(userIdFromRoute)) return null;
    return allUsers.find((u) => u.id === userIdFromRoute) ?? null;
  }, [allUsers, userIdFromRoute]);

  const ownerSkill = ownerData?.skillCanTeach ?? null;

  const subcategoryInfo = useAppSelector(selectSubcategoryById(ownerSkill?.subcategoryId ?? -1));

  const categorySubcategoryIds = useAppSelector(
    selectSubcategoryIdsByCategoryId(subcategoryInfo?.categoryId ?? -1)
  );

  const similarUsersData = useMemo(() => {
    if (!ownerData || !ownerSkill) return [];

    return allUsers.filter((u) => {
      if (u.id === ownerData.id) return false;
      const subId = u.skillCanTeach?.subcategoryId;
      return typeof subId === 'number' && categorySubcategoryIds.includes(subId);
    });
  }, [allUsers, categorySubcategoryIds, ownerData, ownerSkill]);

  const isLiked = authUser?.likedUserIds?.includes(ownerData?.id ?? -1) ?? false;

  const requestSent = useAppSelector(
    selectHasPendingRequest({
      skillId: ownerData?.skillCanTeach?.id ?? -1,
      fromUserId: authUser?.id ?? -1,
      toUserId: ownerData?.id ?? -1,
    })
  );

  const isOwner = (authUser?.id ?? -1) === (ownerData?.id ?? -2);

  const handleLikeClick = () => {
    if (!authUser || !ownerData) return;
    dispatch(
      toggleLike({
        currentUserId: authUser.id,
        targetUserId: ownerData.id,
      })
    );
  };

  const handleShareClick = () => {};

  const handleMoreDetailsClick = (skillId: number) => {
    if (!authUser || !ownerData) {
      navigate('/login');
      return;
    }

    if (authUser.id === ownerData.id) {
      return;
    }

    // Показываем модальное окно успешного создания предложения
    setIsSuccessModalOpen(true);

    // Отправляем запрос на обмен
    dispatch(
      createRequestAndNotify({
        skillId,
        fromUserId: authUser.id,
        toUserId: ownerData.id,
      })
    );
  };

  const handleMoreOptionsClick = () => {};

  const handleUserClick = (targetUserId: number) => {
    navigate(`/skill/${targetUserId}`);
  };

  const handleLikeSimilarUser = (targetUserId: number) => {
    if (!authUser) return;
    dispatch(
      toggleLike({
        currentUserId: authUser.id,
        targetUserId,
      })
    );
  };

  // Обработчик закрытия модального окна успеха
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
  };

  // Обработчик нажатия кнопки "Готово" в модальном окне
  const handleSuccessModalConfirm = () => {
    setIsSuccessModalOpen(false);
  };

  const isLoading = !ownerData || subcategoryState.isLoading;
  const error = !ownerData;

  return (
    <>
      <SkillPageUI
        skill={ownerSkill}
        skillOwner={ownerData}
        similarUsers={similarUsersData}
        isLoading={isLoading}
        isLiked={isLiked}
        requestSent={requestSent}
        isAuth={!!authUser}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        isOwner={isOwner}
        error={error}
        onLikeClick={handleLikeClick}
        onLikeSimilarUser={handleLikeSimilarUser}
        onShareClick={handleShareClick}
        onMoreDetailsClick={handleMoreDetailsClick}
        onMoreOptionsClick={handleMoreOptionsClick}
        onUserClick={handleUserClick}
      />

      {/* Модальное окно успешного создания предложения */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        onConfirm={handleSuccessModalConfirm}
      />
    </>
  );
};

export default SkillPage;
