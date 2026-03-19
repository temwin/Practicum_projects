import type { RootState } from '../../app/providers/store';

export const selectCurrentUserId = (state: RootState) => state.auth.currentUserId;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthRedirectTo = (state: RootState) => state.auth.redirectTo;
export const selectAuthChecked = (state: RootState) => state.auth.authChecked;
