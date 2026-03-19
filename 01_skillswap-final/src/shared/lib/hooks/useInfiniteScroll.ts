import { useEffect, useState, useCallback } from 'react';
import type { RefObject } from 'react';

export const useInfiniteScroll = <T>({
  containerRef,
  loadMoreRef,
  loadData,
  pageSize,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  loadMoreRef: RefObject<HTMLDivElement | null>;
  loadData: (page: number) => T[];
  pageSize: number;
}) => {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // Пока убрал все строчки косаемые лоадера, поскольку в нашем проекте загрузка из локальных данных, а не с сервера
  // const [isLoading, setIsLoading] = useState(false);

  // функция loadMore будет вызыватся при сработке observer
  const loadMore = useCallback(() => {
    // if (isLoading || !hasMore) return;
    if (!hasMore) return;

    // setIsLoading(true);
    // loadData - функция загружающая страницу с номером page, с сервера, или как внашем случае из слайса.
    // логика loadData определяется в компоненте, где вызывается хук
    const nextItems = loadData(page);
    setItems((prev) => [...prev, ...nextItems]);
    setPage((prev) => prev + 1);

    if (nextItems.length < pageSize) setHasMore(false);
    // setIsLoading(false);
  }, [hasMore, loadData, page, pageSize]);

  useEffect(() => {
    if (!containerRef.current || !loadMoreRef.current) return;
    // используем API Intersection Observer, передаем область видимости containerRef и наблюдаемый объект loadMoreRef в разметке на странице
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      {
        root: containerRef.current,
        rootMargin: '200px',
      }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMore, loadMoreRef, containerRef]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, []);

  // return { items, isLoading, hasMore, reset };
  return { items, reset };
};
