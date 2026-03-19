import { describe, test, expect, beforeAll, beforeEach, jest } from '@jest/globals';
import authReducer, {
  logout,
  loginThunk,
  clearAuthError,
  clearRedirect,
  hydrateAuthFromStorage,
} from './authSlice';
import type { AuthState } from './authSlice';

/**
 * Важное примечание:
 * Мы мокаем window.localStorage, так как инициализация слайса зависит от синхронного чтения токена из storage.
 * Также мы проверяем вызовы removeItem для гарантии очистки данных, несмотря на то, что это сайд-эффект в редьюсере.
 */

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
});

describe('authSlice', () => {
  beforeEach(() => {
    (localStorage.getItem as jest.Mock).mockClear();
    (localStorage.setItem as jest.Mock).mockClear();
    (localStorage.removeItem as jest.Mock).mockClear();
  });

  const initialState: AuthState = {
    currentUserId: null,
    isAuthenticated: false,
    status: 'idle',
    error: null,
    redirectTo: null,
    authChecked: false,
  };

  test('должен возвращать начальное состояние', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('должен устанавливать состояние при успешном логине (loginThunk.fulfilled)', () => {
    const payload = {
      token: 'token123',
      userId: 1,
      redirectTo: '/dashboard',
    };

    const action = loginThunk.fulfilled(payload, 'requestId', {
      email: 'test@example.com',
      password: 'password',
    });

    const state = authReducer(initialState, action);

    expect(state.isAuthenticated).toBe(true);
    expect(state.currentUserId).toBe(1);
    expect(state.status).toBe('succeeded');
    expect(state.redirectTo).toBe('/dashboard');
    expect(state.error).toBeNull();
  });

  test('должен устанавливать статус loading при попытке логина (loginThunk.pending)', () => {
    const action = loginThunk.pending('requestId', {
      email: 'test@example.com',
      password: 'password',
    });

    const state = authReducer(initialState, action);

    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  test('должен обрабатывать ошибку при неудачном логине (loginThunk.rejected)', () => {
    const errorMessage = 'Неверный email';
    const action = loginThunk.rejected(
      null,
      'requestId',
      {
        email: 'test@example.com',
        password: 'wrong',
      },
      errorMessage
    );

    const state = authReducer(initialState, action);

    expect(state.status).toBe('failed');
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test('должен очищать данные при вызове logout и удалять токен из localStorage', () => {
    const loggedInState = {
      ...initialState,
      isAuthenticated: true,
      currentUserId: 1,
      authChecked: true,
    };

    const state = authReducer(loggedInState, logout());

    expect(state.isAuthenticated).toBe(false);
    expect(state.currentUserId).toBeNull();
    expect(state.redirectTo).toBe(null);
    expect(state.authChecked).toBe(true);

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('currentUserId');
  });

  test('должен сбрасывать ошибку при clearAuthError', () => {
    const errorState = { ...initialState, error: 'Some error' };
    const state = authReducer(errorState, clearAuthError());
    expect(state.error).toBeNull();
  });

  test('должен сбрасывать redirectTo при clearRedirect', () => {
    const redirectState = { ...initialState, redirectTo: '/profile' };
    const state = authReducer(redirectState, clearRedirect());
    expect(state.redirectTo).toBeNull();
  });

  test('должен восстанавливать сессию из localStorage при hydrateAuthFromStorage', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'token') return 'restored_token';
      if (key === 'currentUserId') return '99';
      return null;
    });

    const state = authReducer(initialState, hydrateAuthFromStorage());

    expect(state.isAuthenticated).toBe(true);
    expect(state.currentUserId).toBe(99);
    expect(state.authChecked).toBe(true);
  });
});
