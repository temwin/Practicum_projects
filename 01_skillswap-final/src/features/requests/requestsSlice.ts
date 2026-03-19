import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/providers/store';
import { loadRequestsFromStorage, saveRequestsToStorage } from './storage';
import type { ExchangeRequest, RequestStatus } from '../../api/types';

export interface RequestsState {
  requests: ExchangeRequest[];
}

export const nowIso = () => new Date().toISOString();

export const generateRequestId = (): string =>
  `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const initialState: RequestsState = {
  requests: loadRequestsFromStorage(),
};

type CreateRequestPayload = {
  skillId: number;
  fromUserId: number;
  toUserId: number;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

type UpdateStatusPayload = {
  id: string;
  status: RequestStatus;
};

export const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    hydrateRequests: (state) => {
      state.requests = loadRequestsFromStorage();
    },

    createRequest: (state, action: PayloadAction<CreateRequestPayload>) => {
      const { skillId, fromUserId, toUserId } = action.payload;

      const alreadyPending = state.requests.some(
        (r) =>
          r.skillId === skillId &&
          r.fromUserId === fromUserId &&
          r.toUserId === toUserId &&
          r.status === 'pending'
      );
      if (alreadyPending) return;

      const ts = action.payload.createdAt ?? nowIso();
      const req: ExchangeRequest = {
        id: action.payload.id ?? generateRequestId(),
        skillId,
        fromUserId,
        toUserId,
        status: 'pending',
        createdAt: ts,
        updatedAt: action.payload.updatedAt ?? ts,
      };

      state.requests.unshift(req);
      saveRequestsToStorage(state.requests);
    },

    updateRequestStatus: (state, action: PayloadAction<UpdateStatusPayload>) => {
      const { id, status } = action.payload;
      const req = state.requests.find((r) => r.id === id);
      if (!req) return;

      req.status = status;
      req.updatedAt = nowIso();
      saveRequestsToStorage(state.requests);
    },

    deleteRequest: (state, action: PayloadAction<{ id: string }>) => {
      state.requests = state.requests.filter((r) => r.id !== action.payload.id);
      saveRequestsToStorage(state.requests);
    },
  },
});

export const { hydrateRequests, createRequest, updateRequestStatus, deleteRequest } =
  requestsSlice.actions;

export const selectAllRequests = (state: RootState) => state.requests.requests;

export const selectHasPendingRequest =
  (args: { skillId: number; fromUserId: number; toUserId: number }) => (state: RootState) =>
    state.requests.requests.some(
      (r) =>
        r.skillId === args.skillId &&
        r.fromUserId === args.fromUserId &&
        r.toUserId === args.toUserId &&
        r.status === 'pending'
    );

export default requestsSlice.reducer;
