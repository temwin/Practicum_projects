import { NOTIFICATIONS_STORAGE_KEY } from './constants';
import type { AppNotification } from '../../api/types';

export function loadNotificationsFromStorage(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((n): n is AppNotification => {
      return (
        typeof n === 'object' &&
        n !== null &&
        typeof (n as AppNotification).id === 'string' &&
        typeof (n as AppNotification).userId === 'number' &&
        typeof (n as AppNotification).actorUserId === 'number' &&
        typeof (n as AppNotification).type === 'string' &&
        typeof (n as AppNotification).requestId === 'string' &&
        typeof (n as AppNotification).skillId === 'number' &&
        typeof (n as AppNotification).createdAt === 'string' &&
        typeof (n as AppNotification).isRead === 'boolean'
      );
    });
  } catch {
    return [];
  }
}

export function saveNotificationsToStorage(notifications: AppNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch {}
}
