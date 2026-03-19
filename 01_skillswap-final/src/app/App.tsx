import { Provider } from 'react-redux';
import { useEffect, useRef } from 'react';

import AppRouter from './AppRouter';
import store, { useAppDispatch, useAppSelector } from './providers/store';

import { fetchCategories } from '../entities/category/model';
import { fetchSubcategories } from '../entities/subcategory/model';
import { fetchSkills } from '../entities/skills/model';
import { fetchCities } from '../entities/city/model';

import { getUsersThunk } from '../entities/user/model';
import { hydrateAuthFromStorage } from '../features/auth';

import { hydrateRequests } from '../features/requests';
import { hydrateNotifications } from '../features/notifications';

const AppContent = () => {
  const didInit = useRef(false);
  const dispatch = useAppDispatch();

  const usersCount = useAppSelector((s) => s.users.users.length);

  useEffect(() => {
    dispatch(hydrateAuthFromStorage());

    if (didInit.current) return;
    didInit.current = true;

    const init = async () => {
      try {
        dispatch(hydrateRequests());
        dispatch(hydrateNotifications());

        await dispatch(fetchSkills()).unwrap();
        await dispatch(fetchCategories()).unwrap();
        await dispatch(fetchSubcategories()).unwrap();
        await dispatch(fetchCities()).unwrap();

        if (usersCount === 0) {
          await dispatch(getUsersThunk()).unwrap();
        }

        dispatch(hydrateAuthFromStorage());
      } catch (e) {
        console.error('Ошибка инициализации приложения', e);
      }
    };

    void init();
  }, [dispatch, usersCount]);

  return <AppRouter />;
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
