import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './providers/ProtectedRoute';
import { Suspense, lazy } from 'react';

const Error404Page = lazy(() => import('../pages/Error404Page'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const RegisterPage = lazy(() => import('../pages/register/RegisterPage'));
const SkillPage = lazy(() => import('../pages/SkillPage'));

const PersonalData = lazy(() => import('../widgets/PersonalData'));
const UserExchanges = lazy(() => import('../widgets/UserExchanges'));
const UserFavorites = lazy(() => import('../widgets/UserFavorites'));
const UserRequests = lazy(() => import('../widgets/UserRequests'));
const UserSkills = lazy(() => import('../widgets/UserSkills'));

import Loader from '../shared/ui/loader/loader';

const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Публичные маршруты */}
        <Route path='/' element={<MainPage />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route path='/skill/:id' element={<SkillPage />} />
        <Route path='/error' element={<Error404Page />} />

        {/* Защищённые маршруты */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to='personal' replace />} />
          <Route path='personal' element={<PersonalData />} />
          <Route path='requests' element={<UserRequests />} />
          <Route path='exchanges' element={<UserExchanges />} />
          <Route path='favorites' element={<UserFavorites />} />
          <Route path='skills' element={<UserSkills />} />
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
