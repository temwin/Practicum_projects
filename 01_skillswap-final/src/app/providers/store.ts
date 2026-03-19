import { configureStore } from '@reduxjs/toolkit';
import {
  type TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from 'react-redux';
import { authReducer } from '../../features/auth';
import { requestsReducer } from '../../features/requests';
import { categoryReducer } from '../../entities/category/model';
import { userReducer } from '../../entities/user/model';
import { skillReducer } from '../../entities/skills/model';
import { subcategoryReducer } from '../../entities/subcategory/model';
import { citiesReducer } from '../../entities/city/model';
import { notificationsReducer } from '../../features/notifications';

const store = configureStore({
  reducer: {
    category: categoryReducer,
    subcategory: subcategoryReducer,
    cities: citiesReducer,
    users: userReducer,
    skills: skillReducer,
    auth: authReducer,
    requests: requestsReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => dispatchHook<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
