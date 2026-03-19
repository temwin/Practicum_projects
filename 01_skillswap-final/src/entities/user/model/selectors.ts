import type { RootState } from '../../../app/providers/store';
import type { User } from '../../../api/types';

/**
 * Селектор всех пользователей
 * Возвращает пустой массив, если users не инициализирован.
 */
export const selectAllUsers = (state: RootState): User[] => {
  if (!state.users || !state.users.users) {
    return [];
  }
  return state.users.users;
};

/**
 * Селектор пользователя по ID
 * Возвращает null, если пользователь не найден или данные не загружены.
 */
export const selectUserById = (state: RootState, userId: number): User | null => {
  if (!state.users || !state.users.users) {
    return null;
  }

  const user = state.users.users.find((u) => u.id === userId);
  return user ?? null;
};

/**
 * Селектор статуса загрузки пользователей
 * Гарантированно возвращает boolean.
 */
export const selectUsersLoading = (state: RootState): boolean => {
  if (!state.users || typeof state.users.isLoading === 'undefined') {
    return false;
  }
  return state.users.isLoading;
};

/**
 * Селектор ошибки загрузки пользователей
 * Возвращает строку или null.
 */
export const selectUsersError = (state: RootState): string | null => {
  if (!state.users || typeof state.users.error === 'undefined') {
    return null;
  }
  return state.users.error;
};

/**
 * Селектор списка ID понравившихся пользователей для конкретного пользователя
 * Возвращает массив ID пользователей, отмеченных как "понравившиеся" указанным пользователем.
 */
export const selectLikedUserIdsById =
  (userId: number) =>
  (state: RootState): number[] =>
    state.users.users.find((u) => u.id === userId)?.likedUserIds ?? [];

/**
 * Вспомогательная функция для добавления email к пользователю
 * Защищает от отсутствующих данных.
 */
const attachEmail = (state: RootState, user: User): User => {
  // Если email уже есть — возвращаем пользователя
  if (user.email) return user;

  // Проверяем наличие credentialsByEmail
  if (!state.users || !state.users.credentialsByEmail) {
    return user;
  }

  // Ищем запись по id пользователя
  const entry = Object.values(state.users.credentialsByEmail).find(
    (c: { id: number; email: string }) => c.id === user.id
  );

  if (!entry?.email) {
    return user;
  }

  // Возвращаем пользователя с добавленным email
  return { ...user, email: entry.email };
};

/**
 * Селектор текущего авторизованного пользователя
 * Включает полную защиту от отсутствующих данных.
 */
export const selectCurrentUser = (state: RootState): User | null => {
  // 1. Проверка наличия раздела auth
  if (!state.auth) {
    return null;
  }

  // 2. Получаем currentUserId (может быть null)
  const currentUserId = state.auth.currentUserId;
  if (!currentUserId) {
    return null;
  }

  // 3. Проверка наличия раздела users
  if (!state.users) {
    return null;
  }

  // 4. Проверка наличия массива users
  if (!state.users.users) {
    return null;
  }

  // 5. Ищем пользователя по id
  const foundUser = state.users.users.find((user) => user.id === currentUserId);
  if (!foundUser) {
    return null;
  }

  // 6. Добавляем email, если возможно
  return attachEmail(state, foundUser);
};
