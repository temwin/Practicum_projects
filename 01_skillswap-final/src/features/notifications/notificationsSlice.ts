import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/providers/store';
import type { AppNotification, NotificationType } from '../../api/types';
import { loadNotificationsFromStorage, saveNotificationsToStorage } from './storage';

export interface NotificationsState {
  notifications: AppNotification[];
}

const nowIso = () => new Date().toISOString();
const generateId = (): string => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const initialState: NotificationsState = {
  notifications: loadNotificationsFromStorage(),
};

export type CreateNotificationPayload = {
  userId: number;
  actorUserId: number;
  type: NotificationType;
  requestId: string;
  skillId: number;
  createdAt?: string;
  isRead?: boolean;
  id?: string;
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    hydrateNotifications: (state) => {
      state.notifications = loadNotificationsFromStorage();
    },

    addNotification: (state, action: PayloadAction<CreateNotificationPayload>) => {
      const { id, createdAt, isRead, ...rest } = action.payload;

      const notif: AppNotification = {
        id: id ?? generateId(),
        createdAt: createdAt ?? nowIso(),
        isRead: isRead ?? false,
        ...rest,
      };

      state.notifications.unshift(notif);
      saveNotificationsToStorage(state.notifications);
    },

    markRead: (state, action: PayloadAction<{ id: string }>) => {
      const n = state.notifications.find((x) => x.id === action.payload.id);
      if (!n) return;
      if (n.isRead) return;

      n.isRead = true;
      saveNotificationsToStorage(state.notifications);
    },

    markAllReadForUser: (state, action: PayloadAction<{ userId: number }>) => {
      let changed = false;
      for (const n of state.notifications) {
        if (n.userId === action.payload.userId && !n.isRead) {
          n.isRead = true;
          changed = true;
        }
      }
      if (changed) saveNotificationsToStorage(state.notifications);
    },

    clearReadForUser: (state, action: PayloadAction<{ userId: number }>) => {
      const before = state.notifications.length;
      state.notifications = state.notifications.filter(
        (n) => !(n.userId === action.payload.userId && n.isRead)
      );
      if (state.notifications.length !== before) {
        saveNotificationsToStorage(state.notifications);
      }
    },
  },
});

export const {
  hydrateNotifications,
  addNotification,
  markRead,
  markAllReadForUser,
  clearReadForUser,
} = notificationsSlice.actions;

export const selectAllNotifications = (state: RootState) => state.notifications.notifications;

export const selectNotificationsByUser = (userId: number) => (state: RootState) =>
  state.notifications.notifications.filter((n) => n.userId === userId);

export const selectUnreadCountByUser = (userId: number) => (state: RootState) =>
  state.notifications.notifications.reduce((acc, n) => {
    if (n.userId !== userId) return acc;
    return acc + (n.isRead ? 0 : 1);
  }, 0);

export default notificationsSlice.reducer;
