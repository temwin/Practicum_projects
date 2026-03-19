import { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainPageView } from './MainPage/MainPageView';
import { useAppDispatch, useAppSelector } from '../app/providers/store';
import { toggleLike } from '../entities/user/model/userSlice';
import { selectIsAuthenticated, selectCurrentUserId } from '../features/auth/index';
import { normalizeGender } from '../shared/helpers/normalizeGender';
import type { User } from '../api/types';
import { useFrozenIds } from '../shared/lib/hooks/useFrozenIds';
import { useInfiniteScroll } from '../shared/lib/hooks/useInfiniteScroll';
import { useGlobalSearch } from '../shared/lib/hooks/useGlobalSearch';

type SkillType = 'all' | 'learn' | 'teach';
type Gender = 'all' | 'male' | 'female';

type SelectedItem = { id: number; name: string };

type FiltersValue = {
  skillType: SkillType;
  gender: Gender;
  selectedSkills: SelectedItem[]; // subcategory ids
  selectedCities: SelectedItem[]; // city ids
};

const defaultFilters: FiltersValue = {
  skillType: 'all',
  gender: 'all',
  selectedSkills: [],
  selectedCities: [],
};

const MainPage = () => {
  const dispatch = useAppDispatch();
  const PAGE_SIZE = 6; // количество карточек в порции загрузки

  // Используем глобальный поиск
  const { searchValue, handleSearchChange } = useGlobalSearch();

  // создаем ссылки, которые передадим в MainPageView для бесконечного скрола
  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // UI state
  const [filters, setFilters] = useState<FiltersValue>(defaultFilters);
  const [showAllPopular, setShowAllPopular] = useState(false); // новое состояние
  const [showAllNew, setShowAllNew] = useState(false); // состояние для "Новое"

  // redux state
  const allUsers = useAppSelector((state) => state.users.users);
  const isLoading = useAppSelector((state) => state.users.isLoading);
  const error = useAppSelector((state) => state.users.error);

  const isAuth = useAppSelector(selectIsAuthenticated);
  const currentUserId = useAppSelector(selectCurrentUserId);

  const navigate = useNavigate();

  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return allUsers.find((u) => u.id === currentUserId) ?? null;
  }, [allUsers, currentUserId]);

  // режим "подходящие предложения": включается если есть поиск или любой фильтр
  const isMatchMode = useMemo(() => {
    const hasSearch = searchValue.trim().length > 0;
    const hasFilters =
      filters.skillType !== 'all' ||
      filters.gender !== 'all' ||
      filters.selectedSkills.length > 0 ||
      filters.selectedCities.length > 0;

    return hasSearch || hasFilters;
  }, [searchValue, filters]);

  // основной фильтр: поиск ТОЛЬКО по навыку + фильтры слева
  const matchedUsers = useMemo(() => {
    const q = searchValue.trim().toLowerCase();

    // выбранные подкатегории (из FilterTree навыков)
    const selectedSubcategoryIds = filters.selectedSkills.map((s) => Number(s.id));
    const selectedCityIds = filters.selectedCities.map((c) => Number(c.id));

    return allUsers.filter((u) => {
      // не показываем самого себя
      if (currentUserId && u.id === currentUserId) return false;

      // 1) Пол автора (универсально)
      if (filters.gender !== 'all') {
        const ug = normalizeGender(u.gender);
        if (ug !== filters.gender) return false;
      }

      // 2) Город
      if (selectedCityIds.length > 0) {
        const cityId = typeof u.location === 'number' ? u.location : u.location?.id;

        // если cityId undefined или не в выбранных городах — фильтруем
        if (!cityId || !selectedCityIds.includes(cityId)) {
          return false;
        }
      }

      // 3) Поиск по навыку (только skillCanTeach.name)
      if (q) {
        const teachSkillName = u.skillCanTeach?.name?.toLowerCase() ?? '';
        if (!teachSkillName.includes(q)) return false;
      }

      // 4) Фильтр по выбранным подкатегориям + режим (learn/teach/all)
      if (selectedSubcategoryIds.length > 0) {
        const canTeach = u.skillCanTeach
          ? selectedSubcategoryIds.includes(Number(u.skillCanTeach.subcategoryId))
          : false;

        const wantsLearnSelected = (u.subcategoriesWantToLearn ?? []).some((sc) =>
          selectedSubcategoryIds.includes(Number(sc.id))
        );

        switch (filters.skillType) {
          case 'teach':
            if (!canTeach) return false;
            break;
          case 'learn':
            if (!wantsLearnSelected) return false;
            break;
          case 'all':
            if (!canTeach && !wantsLearnSelected) return false;
            break;
        }
      }

      return true;
    });
  }, [allUsers, searchValue, filters, currentUserId]);

  // приводим пользователей к формату карточек (isLiked/likesCount)
  const toCardUsers = useMemo(() => {
    const likedSet = new Set(currentUser?.likedUserIds ?? []);
    return (list: User[]) =>
      list.map((u) => ({
        ...u,
        isLiked: likedSet.has(u.id),
        likesCount: u.liked,
      }));
  }, [currentUser]);

  const matchUsersAll = useMemo(() => {
    if (!isMatchMode) return [];
    return toCardUsers(matchedUsers);
  }, [isMatchMode, matchedUsers, toCardUsers]);

  // Устанавливаем функцию загрузки порции отфильтрованных карточек для пагинации
  const getNextMatchUsers = (page: number) => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return matchUsersAll.slice(start, end);
  };

  // Вызываем хук с пагинацией через бесконечный скрол
  const { items: matchUsers, reset: resetMatchUsers } = useInfiniteScroll<
    User & { isLiked?: boolean; likesCount?: number }
  >({
    containerRef,
    loadMoreRef,
    loadData: getNextMatchUsers,
    pageSize: PAGE_SIZE,
  });

  const resetKey = `${currentUserId ?? 'guest'}:${isMatchMode ? 'match' : 'main'}`;

  // POPULAR: фиксируем топ-10 по liked при заходе на страницу
  const popularIds = useFrozenIds(
    allUsers,
    (items) =>
      [...items]
        .sort((a, b) => (b.liked ?? 0) - (a.liked ?? 0))
        .slice(0, 10)
        .map((u) => u.id),
    { enabled: !isMatchMode, resetKey }
  );

  // RECOMMENDED: фиксируем рекомендованных пользователей при заходе на страницу
  const recommendedIds = useFrozenIds(
    allUsers,
    (items) => {
      // "снимок" likedUserIds на момент захода на страницу
      const likedSet = new Set(currentUser?.likedUserIds ?? []);
      const base = currentUserId
        ? items.filter((u) => !likedSet.has(u.id) && u.id !== currentUserId)
        : items;

      return base.map((u) => u.id);
    },
    { enabled: !isMatchMode, resetKey }
  );

  // обычные секции (когда нет поиска/фильтров)
  const allPopularUsers = useMemo(() => {
    if (isMatchMode) return [];

    const byId = new Map(allUsers.map((u) => [u.id, u]));
    const snapshot = popularIds.map((id) => byId.get(id)).filter((u): u is User => Boolean(u));

    return toCardUsers(snapshot);
  }, [isMatchMode, allUsers, popularIds, toCardUsers]);

  // Ограниченный список популярных пользователей (первые 3)
  const popularUsers = useMemo(() => {
    if (isMatchMode) return [];
    return showAllPopular ? allPopularUsers : allPopularUsers.slice(0, 3);
  }, [isMatchMode, showAllPopular, allPopularUsers]);

  // Все новые пользователи (отсортированные по дате создания)
  const allNewUsers = useMemo(() => {
    if (isMatchMode) return [];

    return toCardUsers(
      [...allUsers]
        .sort((a, b) => {
          const dateA = a.createdAt ? Date.parse(a.createdAt) : 0;
          const dateB = b.createdAt ? Date.parse(b.createdAt) : 0;
          return dateB - dateA;
        })
    );
  }, [isMatchMode, allUsers, toCardUsers]);

  // Ограниченный список новых пользователей (первые 3)
  const newUsers = useMemo(() => {
    if (isMatchMode) return [];
    return showAllNew ? allNewUsers : allNewUsers.slice(0, 3);
  }, [isMatchMode, showAllNew, allNewUsers]);

  const recommendedUsersAll = useMemo(() => {
    if (isMatchMode) return [];

    const byId = new Map(allUsers.map((u) => [u.id, u]));
    const snapshot = recommendedIds.map((id) => byId.get(id)).filter((u): u is User => Boolean(u));

    return toCardUsers(snapshot);
  }, [isMatchMode, allUsers, recommendedIds, toCardUsers]);

  // Устанавливаем функцию загрузки порции рекомендованных карточек для пагинации
  const getNextRecommended = (page: number) => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return recommendedUsersAll.slice(start, end);
  };

  // Вызываем хук с пагинацией через бесконечный скрол
  const { items: recommendedUsers, reset: resetRecommendedUsers } = useInfiniteScroll<
    User & { isLiked?: boolean; likesCount?: number }
  >({
    containerRef,
    loadMoreRef,
    loadData: getNextRecommended,
    pageSize: PAGE_SIZE,
  });

  // Сброс внутреннего состояния хука useInfiniteScroll при фильтрах / поиске
  useEffect(() => {
    resetRecommendedUsers();
    resetMatchUsers();
    // Сбрасываем состояния развернутых секций при изменении фильтров
    setShowAllPopular(false);
    setShowAllNew(false);
  }, [filters, searchValue, resetMatchUsers, resetRecommendedUsers]);

  // лайки
  const handleLikeClick = (targetUserId: number) => {
    if (!isAuth || !currentUserId) {
      navigate('/login');
      return;
    }
    dispatch(toggleLike({ currentUserId, targetUserId }));
  };

  // Обработчик нажатия на кнопку "Смотреть все" в секции популярных
  const handleShowAllPopular = () => {
    setShowAllPopular(true);
  };

  // Обработчик нажатия на кнопку "Смотреть все" в секции новых
  const handleShowAllNew = () => {
    setShowAllNew(true);
  };

  return (
    <>
      <MainPageView
        popularUsers={popularUsers}
        newUsers={newUsers}
        recommendedUsers={recommendedUsers}
        isMatchMode={isMatchMode}
        matchUsers={matchUsers}
        isAuth={isAuth}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFiltersChange={setFilters}
        isLoading={isLoading}
        error={error ?? undefined}
        onLikeClick={handleLikeClick}
        containerRef={containerRef}
        loadMoreRef={loadMoreRef}
        showAllPopular={showAllPopular}
        onShowAllPopular={handleShowAllPopular}
        allPopularUsers={allPopularUsers}
        showAllNew={showAllNew}
        onShowAllNew={handleShowAllNew}
        allNewUsers={allNewUsers}
      />
    </>
  );
};

export default MainPage;