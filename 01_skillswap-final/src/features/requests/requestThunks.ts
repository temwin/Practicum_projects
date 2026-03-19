import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/providers/store';
import { addNotification } from '../notifications';
import {
  createRequest,
  deleteRequest,
  generateRequestId,
  nowIso,
  updateRequestStatus,
} from './requestsSlice';
import type { RequestStatus } from '../../api/types';

type CreateRequestArgs = {
  skillId: number;
  fromUserId: number;
  toUserId: number;
};

export const createRequestAndNotify = createAsyncThunk<
  { requestId: string },
  CreateRequestArgs,
  { state: RootState }
>('requests/createRequestAndNotify', async (args, { dispatch, getState }) => {
  const ts = nowIso();
  const requestId = generateRequestId();

  dispatch(
    createRequest({
      ...args,
      id: requestId,
      createdAt: ts,
      updatedAt: ts,
    })
  );

  const created = getState().requests.requests.some((r) => r.id === requestId);
  if (!created) return { requestId };

  dispatch(
    addNotification({
      userId: args.toUserId,
      actorUserId: args.fromUserId,
      type: 'exchange_proposed',
      requestId,
      skillId: args.skillId,
      createdAt: ts,
    })
  );

  return { requestId };
});

type UpdateRequestStatusArgs = {
  id: string;
  status: RequestStatus;
};

export const updateRequestStatusAndNotify = createAsyncThunk<
  void,
  UpdateRequestStatusArgs,
  { state: RootState }
>('requests/updateRequestStatusAndNotify', async ({ id, status }, { dispatch, getState }) => {
  const state = getState();
  const req = state.requests.requests.find((r) => r.id === id);
  if (!req) return;

  dispatch(updateRequestStatus({ id, status }));

  const map: Partial<
    Record<
      RequestStatus,
      'exchange_accepted' | 'exchange_rejected' | 'exchange_in_progress' | 'exchange_done'
    >
  > = {
    accepted: 'exchange_accepted',
    rejected: 'exchange_rejected',
    inProgress: 'exchange_in_progress',
    done: 'exchange_done',
  };

  const type = map[status];
  if (!type) return;

  dispatch(
    addNotification({
      userId: req.fromUserId,
      actorUserId: req.toUserId,
      type,
      requestId: req.id,
      skillId: req.skillId,
    })
  );
});

export const deleteRequestAndNotify = createAsyncThunk<void, { id: string }, { state: RootState }>(
  'requests/deleteRequestAndNotify',
  async ({ id }, { dispatch, getState }) => {
    const state = getState();
    const req = state.requests.requests.find((r) => r.id === id);

    dispatch(deleteRequest({ id }));

    if (!req) return;
    if (req.status !== 'pending') return;

    dispatch(
      addNotification({
        userId: req.toUserId,
        actorUserId: req.fromUserId,
        type: 'exchange_canceled',
        requestId: req.id,
        skillId: req.skillId,
      })
    );
  }
);
