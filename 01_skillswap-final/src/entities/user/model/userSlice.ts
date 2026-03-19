import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../../app/providers/store';
import type { User, City, Skill, Subcategory, Category } from '../../../api/types';
import { getUsers } from '../../../api/';

export type Credentials = {
  id: number;
  email: string;
  password: string;
};

export type NewUserPayload = {
  profile: Omit<User, 'id' | 'liked' | 'likedUserIds'>;
  email: string;
  password: string;
};

export type UpdateUserPayload = {
  id: number;
  changes: Partial<Omit<User, 'id' | 'liked' | 'likedUserIds'>> & {
    email?: string;
    password?: string;
  };
};

export interface ToggleLikePayload {
  currentUserId: number;
  targetUserId: number;
}

export interface UserState {
  users: User[];
  currentUser: User | null;
  credentialsByEmail: Record<string, Credentials>;
  nextUserId: number;
  isLoading: boolean;
  error: string | null;
}

const USERS_KEY = 'users';
const CREDS_KEY = 'credentialsByEmail';
const NEXT_ID_KEY = 'nextUserId';
const CURRENT_USER_KEY = 'currentUser';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const getStoredUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? (JSON.parse(data) as User[]) : [];
};

const setStoredUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getStoredCreds = (): Record<string, Credentials> => {
  const data = localStorage.getItem(CREDS_KEY);
  return data ? (JSON.parse(data) as Record<string, Credentials>) : {};
};

const setStoredCreds = (creds: Record<string, Credentials>) => {
  localStorage.setItem(CREDS_KEY, JSON.stringify(creds));
};

const getStoredNextUserId = (fallback = 51): number => {
  const raw = localStorage.getItem(NEXT_ID_KEY);
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const setStoredNextUserId = (n: number) => {
  localStorage.setItem(NEXT_ID_KEY, String(n));
};

const getStoredUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? (JSON.parse(user) as User) : null;
};

type UserDto = Omit<User, 'location' | 'skillCanTeach' | 'subcategoriesWantToLearn'> & {
  location: number;
  skillCanTeach: number;
  subcategoriesWantToLearn: number[];
};

const UNKNOWN_CITY: City = { id: -1, name: 'Неизвестный город' };

const UNKNOWN_SKILL: Skill = {
  id: -1,
  subcategoryId: -1,
  name: 'Неизвестный навык',
  description: '',
};

const UNKNOWN_SUBCATEGORY: Subcategory = {
  id: -1,
  name: 'Неизвестная подкатегория',
  categoryId: -1,
};

export const getUsersThunk = createAsyncThunk<User[], void, { state: RootState }>(
  'users/fetchAll',
  async (_, { getState }) => {
    const state = getState();

    const skills = state.skills.skills ?? [];
    const subcategories = state.subcategory.subcategories ?? [];
    const cities = state.cities.cities ?? [];
    const categories = state.category.categories ?? [];

    const cityById = new Map<number, City>(cities.map((c) => [c.id, c]));
    const skillById = new Map<number, Skill>(skills.map((s) => [s.id, s]));
    const subById = new Map<number, Subcategory>(subcategories.map((s) => [s.id, s]));
    const categoryById = new Map<number, Category>(categories.map((c) => [c.id, c]));

    const raw = (await getUsers()) as unknown as UserDto[];

    const users: User[] = raw.map((u) => {
      const city = cityById.get(u.location) ?? UNKNOWN_CITY;
      const skill = skillById.get(u.skillCanTeach) ?? UNKNOWN_SKILL;

      const subcategoryForSkill = subById.get(skill.subcategoryId) ?? UNKNOWN_SUBCATEGORY;

      const categoryForSubcategory = categories.find(
        (cat) => cat.id === subcategoryForSkill.categoryId
      );

      const resolvedSubcats = Array.isArray(u.subcategoriesWantToLearn)
        ? u.subcategoriesWantToLearn.map((id) => {
            const subcat = subById.get(id) ?? UNKNOWN_SUBCATEGORY;
            return {
              ...subcat,
              category: categoryById.get(subcat.categoryId),
            };
          })
        : [];

      return {
        ...u,
        location: city,
        skillCanTeach: {
          ...skill,
          subcategory: subcategoryForSkill,
          category: categoryForSubcategory,
        },
        subcategoriesWantToLearn: resolvedSubcats,
      };
    });

    return users;
  }
);

const initialState: UserState = {
  users: getStoredUsers(),
  currentUser: getStoredUser(),
  credentialsByEmail: getStoredCreds(),
  nextUserId: getStoredNextUserId(),
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<NewUserPayload>) => {
      const { profile, email, password } = action.payload;
      const normalizedEmail = normalizeEmail(email);

      if (state.credentialsByEmail[normalizedEmail]) {
        state.error = 'Пользователь с таким email уже существует';
        return;
      }

      const id = state.nextUserId;

      const { password: _pw, ...safeProfile } = profile as unknown as {
        password?: unknown;
      } & Record<string, unknown>;

      const newUser: User = {
        id,
        ...(safeProfile as Omit<User, 'id' | 'liked' | 'likedUserIds'>),
        email: normalizedEmail,
        createdAt: new Date().toISOString(),
        liked: 0,
        likedUserIds: [],
      };

      state.users.push(newUser);
      state.credentialsByEmail[normalizedEmail] = { id, email: normalizedEmail, password };
      state.nextUserId += 1;

      setStoredUsers(state.users);
      setStoredCreds(state.credentialsByEmail);
      setStoredNextUserId(state.nextUserId);
    },

    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      if (action.payload) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(action.payload));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    updateUser: (state, action: PayloadAction<UpdateUserPayload>) => {
      const { id, changes } = action.payload;
      const user = state.users.find((u) => u.id === id);
      if (!user) return;

      const { email, password, ...profileChanges } = changes;

      const existingEntry = Object.values(state.credentialsByEmail).find((c) => c.id === id);
      const oldEmail =
        existingEntry?.email ?? (user.email ? normalizeEmail(user.email) : undefined);
      const nextEmail = email !== undefined ? normalizeEmail(email) : oldEmail;

      if (nextEmail && oldEmail && nextEmail !== oldEmail && state.credentialsByEmail[nextEmail]) {
        state.error = 'Пользователь с таким email уже существует';
        return;
      }

      if (profileChanges.location && typeof profileChanges.location !== 'object') {
        profileChanges.location = { id: Number(profileChanges.location), name: '' };
      }

      Object.assign(user, profileChanges);

      if (nextEmail) {
        user.email = nextEmail;
      }

      if (nextEmail) {
        const prev = state.credentialsByEmail[oldEmail ?? nextEmail];
        const nextPassword =
          password ??
          existingEntry?.password ??
          (user as unknown as { password?: string }).password ??
          prev?.password ??
          '';

        if (oldEmail && nextEmail !== oldEmail) {
          if (oldEmail in state.credentialsByEmail) {
            delete state.credentialsByEmail[oldEmail];
          }
          state.credentialsByEmail[nextEmail] = { id, email: nextEmail, password: nextPassword };
        } else {
          state.credentialsByEmail[nextEmail] = { id, email: nextEmail, password: nextPassword };
        }
      }

      if (state.currentUser?.id === id) {
        state.currentUser = { ...user };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(state.currentUser));
      }

      setStoredUsers(state.users);
      setStoredCreds(state.credentialsByEmail);
      setStoredNextUserId(state.nextUserId);
    },

    toggleLike: (state, action: PayloadAction<ToggleLikePayload>) => {
      const { currentUserId, targetUserId } = action.payload;

      if (currentUserId === targetUserId) return;

      const currentUser = state.users.find((u) => u.id === currentUserId);
      const targetUser = state.users.find((u) => u.id === targetUserId);

      if (!currentUser || !targetUser) return;

      const hasLike = currentUser.likedUserIds?.includes(targetUserId);

      if (hasLike) {
        currentUser.likedUserIds = currentUser.likedUserIds?.filter((uid) => uid !== targetUserId);
        targetUser.liked = Math.max(0, (targetUser.liked ?? 0) - 1);
      } else {
        currentUser.likedUserIds = currentUser.likedUserIds ?? [];
        currentUser.likedUserIds.push(targetUserId);
        targetUser.liked = (targetUser.liked ?? 0) + 1;
      }

      if (state.currentUser?.id === currentUserId) {
        state.currentUser = { ...currentUser };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(state.currentUser));
      }

      setStoredUsers(state.users);
    },

    clearUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const loaded = action.payload;

        const loadedSafeUsers: User[] = loaded.map((u) => {
          const { password, ...safeUser } = u as unknown as { password?: unknown } & User;
          if (safeUser.email) safeUser.email = normalizeEmail(String(safeUser.email));
          return safeUser;
        });

        const loadedCreds: Record<string, Credentials> = {};
        for (const u of loaded) {
          if (u.email) {
            const e = normalizeEmail(String(u.email));
            loadedCreds[e] = {
              id: u.id,
              email: e,
              password: (u as unknown as { password?: string }).password ?? '',
            };
          }
        }

        if (state.users.length === 0) {
          state.users = loadedSafeUsers;
          state.credentialsByEmail = loadedCreds;
        } else {
          const byId = new Map<number, User>(state.users.map((u) => [u.id, u]));
          for (const u of loadedSafeUsers) {
            if (!byId.has(u.id)) {
              state.users.push(u);
              byId.set(u.id, u);
            }
          }

          for (const [email, cred] of Object.entries(loadedCreds)) {
            if (!state.credentialsByEmail[email]) {
              state.credentialsByEmail[email] = cred;
            }
          }
        }

        const maxId = state.users.reduce((max, u) => Math.max(max, u.id), 0);
        state.nextUserId = Math.max(state.nextUserId, maxId + 1);

        setStoredUsers(state.users);
        setStoredCreds(state.credentialsByEmail);
        setStoredNextUserId(state.nextUserId);
      })
      .addCase(getUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки пользователей';
      });
  },
});

export const { addUser, updateUser, toggleLike, setCurrentUser, setError, clearUsersError } =
  userSlice.actions;

export default userSlice.reducer;
