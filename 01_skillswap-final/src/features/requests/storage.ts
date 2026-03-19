import { REQUESTS_STORAGE_KEY } from './constants';
import type { ExchangeRequest } from '../../api/types';

export function loadRequestsFromStorage(): ExchangeRequest[] {
  try {
    const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((r): r is ExchangeRequest => {
      return (
        typeof r === 'object' &&
        r !== null &&
        typeof (r as ExchangeRequest).id === 'string' &&
        typeof (r as ExchangeRequest).skillId === 'number' &&
        typeof (r as ExchangeRequest).fromUserId === 'number' &&
        typeof (r as ExchangeRequest).toUserId === 'number' &&
        typeof (r as ExchangeRequest).status === 'string' &&
        typeof (r as ExchangeRequest).createdAt === 'string' &&
        typeof (r as ExchangeRequest).updatedAt === 'string'
      );
    });
  } catch {
    return [];
  }
}

export function saveRequestsToStorage(requests: ExchangeRequest[]): void {
  try {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  } catch {}
}
