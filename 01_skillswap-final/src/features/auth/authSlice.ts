import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/providers/store';

const AUTH_TOKEN_KEY = 'token';
const AUTH_USER_ID_KEY = 'currentUserId';

type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AuthState {
  currentUserId: number | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  error: string | null;
  redirectTo: string | null;
  authChecked: boolean;
}

const tokenFromStorage = localStorage.getItem(AUTH_TOKEN_KEY);
const userIdFromStorage = localStorage.getItem(AUTH_USER_ID_KEY);

const initialState: AuthState = {
  currentUserId: userIdFromStorage ? Number(userIdFromStorage) : null,
  isAuthenticated: Boolean(tokenFromStorage && userIdFromStorage),
  status: 'idle',
  error: null,
  redirectTo: null,
  authChecked: false,
};

export type LoginPayload = {
  email: string;
  password: string;

  redirectTo?: string;
};

type LoginResult = {
  token: string;
  userId: number;
  redirectTo: string;
};

export const loginThunk = createAsyncThunk<
  LoginResult,
  LoginPayload,
  { state: RootState; rejectValue: string }
>('auth/login', async ({ email, password, redirectTo }, { getState, rejectWithValue }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const creds = getState().users.credentialsByEmail[normalizedEmail];

  if (!creds || creds.password !== password) {
    return rejectWithValue('Неверный email или пароль');
  }

  const token = 'token123';

  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_ID_KEY, String(creds.id));

  return { token, userId: creds.id, redirectTo: redirectTo || '/' };
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_ID_KEY);

      state.currentUserId = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      state.redirectTo = null;
      state.authChecked = true;
    },

    clearRedirect: (state) => {
      state.redirectTo = null;
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    hydrateAuthFromStorage: (state) => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const uid = localStorage.getItem(AUTH_USER_ID_KEY);

      state.currentUserId = uid ? Number(uid) : null;
      state.isAuthenticated = Boolean(token && uid);
      state.authChecked = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.redirectTo = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUserId = action.payload.userId;
        state.isAuthenticated = true;
        state.error = null;
        state.redirectTo = action.payload.redirectTo;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.currentUserId = null;
        state.redirectTo = null;

        state.error = action.payload || action.error.message || 'Ошибка авторизации';
      });
  },
});

export const { logout, clearRedirect, clearAuthError, hydrateAuthFromStorage } = authSlice.actions;

export default authSlice.reducer;
