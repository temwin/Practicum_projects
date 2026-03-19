export interface Category {
  id: number;
  name: string;
  color?: string;
}

export interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  category?: Category;
}

export interface City {
  id: number;
  name: string;
}

export interface Skill {
  id: number;
  subcategoryId: number;
  name: string;
  description: string;
  category?: Category;
  subcategory?: Subcategory;
}

export type UserLocation = number | City;

export interface User {
  id: number;
  avatarUrl: string;
  name: string;
  location: UserLocation;
  dateOfBirth: string;
  gender: string;
  email?: string;
  password?: string;
  about: string;
  greeting?: string;
  createdAt?: string;
  liked?: number;
  likedUserIds?: number[];
  skillCanTeach?: Skill;
  subcategoriesWantToLearn?: Subcategory[];
  images?: string[];
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done';

export interface ExchangeRequest {
  id: string;
  skillId: number;
  fromUserId: number;
  toUserId: number;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType =
  | 'exchange_proposed'
  | 'exchange_accepted'
  | 'exchange_rejected'
  | 'exchange_in_progress'
  | 'exchange_done'
  | 'exchange_canceled';

export interface AppNotification {
  id: string;
  userId: number;
  actorUserId: number;
  type: NotificationType;
  requestId: string;
  skillId: number;
  createdAt: string;
  isRead: boolean;
}
