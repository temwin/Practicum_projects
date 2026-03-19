import type { User } from '../../../api/types';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/providers/store';
import { selectAllUsers, selectLikedUserIdsById, toggleLike } from '../../../entities/user/model';
import { selectCurrentUserId } from '../../../features/auth';
import UserFavorites from './UserFavorites';

export const UserFavoritesContainer = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector(selectCurrentUserId);
  const allUsers = useAppSelector(selectAllUsers);
  const likedUserIds = useAppSelector(
    currentUserId ? selectLikedUserIdsById(currentUserId) : () => []
  );
  //Отфильтровываем карточки, Id которых находятся в likedUserIds
  const favorites: User[] = allUsers.filter((user) => likedUserIds.includes(user.id));

  const handleRemove = (id: number) => {
    if (currentUserId) {
      dispatch(toggleLike({ currentUserId, targetUserId: id }));
    }
  };

  const handleUserClick = (userId: number) => {
    navigate(`/skill/${userId}`);
  };

  return <UserFavorites users={favorites} onRemove={handleRemove} onUserClick={handleUserClick} />;
};

export default UserFavoritesContainer;
