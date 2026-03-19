import { expect, test, describe, beforeEach } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  addUser,
  updateUser,
  toggleLike,
  setCurrentUser,
  clearUsersError,
} from './userSlice';
import type { UserState, NewUserPayload, UpdateUserPayload, ToggleLikePayload } from './userSlice';
import type { User } from '../../../api/types';

describe('тесты слайса users', () => {
  let store: ReturnType<typeof configureStore>;

  const mockUser1: User = {
    id: 1,
    name: 'Иван',
    avatarUrl: 'avatar1.jpg',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    about: 'О себе 1',
    location: { id: 1, name: 'Москва' },
    skillCanTeach: {
      id: 1,
      subcategoryId: 1,
      name: 'React',
      description: 'JavaScript библиотека',
      subcategory: { id: 1, name: 'Frontend', categoryId: 1 },
      category: { id: 1, name: 'Программирование' },
    },
    subcategoriesWantToLearn: [{ id: 2, name: 'Backend', categoryId: 1 }],
    liked: 5,
    likedUserIds: [2, 3],
  };

  const mockUser2: User = {
    id: 2,
    name: 'Мария',
    avatarUrl: 'avatar2.jpg',
    dateOfBirth: '1992-02-02',
    gender: 'female',
    about: 'О себе 2',
    location: { id: 2, name: 'Санкт-Петербург' },
    skillCanTeach: {
      id: 2,
      subcategoryId: 2,
      name: 'Дизайн',
      description: 'UI/UX дизайн',
      subcategory: { id: 2, name: 'Дизайн', categoryId: 2 },
      category: { id: 2, name: 'Дизайн' },
    },
    subcategoriesWantToLearn: [{ id: 1, name: 'Frontend', categoryId: 1 }],
    liked: 3,
    likedUserIds: [1],
  };

  const initialState: UserState = {
    users: [mockUser1, mockUser2],
    currentUser: null,
    credentialsByEmail: {
      'ivan@test.com': { id: 1, email: 'ivan@test.com', password: 'pass1' },
      'maria@test.com': { id: 2, email: 'maria@test.com', password: 'pass2' },
    },
    nextUserId: 3,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    store = configureStore({
      reducer: { users: userReducer },
      preloadedState: { users: initialState },
    });
  });

  test('начальное состояние', () => {
    const emptyStore = configureStore({
      reducer: { users: userReducer },
    });

    const state = emptyStore.getState() as { users: UserState };
    expect(state.users.users).toEqual([]);
    expect(state.users.currentUser).toBeNull();
    expect(state.users.isLoading).toBe(false);
    expect(state.users.error).toBeNull();
  });

  test('addUser: добавление нового пользователя', () => {
    const newUserPayload: NewUserPayload = {
      profile: {
        name: 'Алексей',
        avatarUrl: 'avatar3.jpg',
        dateOfBirth: '1995-03-03',
        gender: 'male',
        about: 'О себе 3',
        location: { id: 3, name: 'Казань' },
        skillCanTeach: {
          id: 3,
          subcategoryId: 3,
          name: 'Английский',
          description: 'Английский язык',
          subcategory: { id: 3, name: 'Языки', categoryId: 3 },
          category: { id: 3, name: 'Образование' },
        },
        subcategoriesWantToLearn: [{ id: 4, name: 'Немецкий', categoryId: 3 }],
      },
      email: 'alex@test.com',
      password: 'pass3',
    };

    store.dispatch(addUser(newUserPayload));
    const state = store.getState() as { users: UserState };

    expect(state.users.users).toHaveLength(3);
    expect(state.users.users[2]).toMatchObject({
      id: 3,
      name: 'Алексей',
      liked: 0,
      likedUserIds: [],
    });
    expect(state.users.credentialsByEmail['alex@test.com']).toEqual({
      id: 3,
      email: 'alex@test.com',
      password: 'pass3',
    });
    expect(state.users.nextUserId).toBe(4);
  });

  test('addUser: ошибка при дублировании email', () => {
    const duplicatePayload: NewUserPayload = {
      profile: {
        name: 'Дубликат',
        avatarUrl: 'avatar4.jpg',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        about: 'О себе',
        location: { id: 1, name: 'Москва' },
        skillCanTeach: mockUser1.skillCanTeach,
        subcategoriesWantToLearn: mockUser1.subcategoriesWantToLearn,
      },
      email: 'ivan@test.com',
      password: 'pass',
    };

    store.dispatch(addUser(duplicatePayload));
    const state = store.getState() as { users: UserState };

    expect(state.users.users).toHaveLength(2); 
    expect(state.users.error).toBe('Пользователь с таким email уже существует');
  });

  test('updateUser: обновление профиля пользователя', () => {
    const updatePayload: UpdateUserPayload = {
      id: 1,
      changes: {
        name: 'Иван Обновленный',
        about: 'Новое описание',
      },
    };

    store.dispatch(updateUser(updatePayload));
    const state = store.getState() as { users: UserState };

    const updatedUser = state.users.users.find(u => u.id === 1);
    expect(updatedUser?.name).toBe('Иван Обновленный');
    expect(updatedUser?.about).toBe('Новое описание');
  });

  test('toggleLike: добавление лайка', () => {
  const cleanInitialState: UserState = {
    ...initialState,
    users: [
      { ...mockUser1, likedUserIds: [] },
      { ...mockUser2, likedUserIds: [] },
    ],
  };
  
  const store = configureStore({
    reducer: { users: userReducer },
    preloadedState: { users: cleanInitialState },
  });

  const likePayload: ToggleLikePayload = {
    currentUserId: 1,
    targetUserId: 2,
  };

  store.dispatch(toggleLike(likePayload));
  const state = store.getState() as { users: UserState };

  const currentUser = state.users.users.find(u => u.id === 1);
  const targetUser = state.users.users.find(u => u.id === 2);

  expect(currentUser?.likedUserIds).toContain(2);
  expect(targetUser?.liked).toBe(4); 
});
  test('toggleLike: удаление лайка', () => {
    const likePayload: ToggleLikePayload = {
      currentUserId: 2,
      targetUserId: 1,
    };

    store.dispatch(toggleLike(likePayload));
    const state = store.getState() as { users: UserState };

    const currentUser = state.users.users.find(u => u.id === 2);
    const targetUser = state.users.users.find(u => u.id === 1);

    expect(currentUser?.likedUserIds).not.toContain(1);
    expect(targetUser?.liked).toBe(4);
  });

  test('setCurrentUser: установка и очистка текущего пользователя', () => {

    store.dispatch(setCurrentUser(mockUser1));
    let state = store.getState() as { users: UserState };
    expect(state.users.currentUser).toEqual(mockUser1);


    store.dispatch(setCurrentUser(null));
    state = store.getState() as { users: UserState };
    expect(state.users.currentUser).toBeNull();
  });

  test('clearUsersError: очистка ошибки', () => {
    store.dispatch({ type: 'users/setError', payload: 'Тестовая ошибка' });
    
    let state = store.getState() as { users: UserState };
    expect(state.users.error).toBe('Тестовая ошибка');

    store.dispatch(clearUsersError());
    state = store.getState() as { users: UserState };
    expect(state.users.error).toBeNull();
  });
});
