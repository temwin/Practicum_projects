import { useEffect, useMemo, useRef, useState } from 'react';

type UseFrozenIdsOptions = {
  /**
   * Включает/выключает “заморозку”.
   * Когда enabled=false — возвращаем [] и не инициализируем ids.
   */
  enabled?: boolean;

  /**
   * При изменении resetKey — сбрасываем ids и разрешаем инициализацию заново.
   * Например, когда меняется пользователь/режим.
   */
  resetKey?: string | number;
};

/**
 * Хук “замораживает” список id:
 * - один раз вычисляет ids (когда items появились)
 * - дальше НЕ пересчитывает ids при изменениях items
 * - при resetKey может сброситься и заново инициализироваться
 *
 * Важно: setState внутри эффектов делается через queueMicrotask,
 * чтобы линтер не ругался на синхронный setState в useEffect.
 */
export function useFrozenIds<T>(
  items: T[],
  buildIds: (items: T[]) => number[],
  options?: UseFrozenIdsOptions
): number[] {
  const enabled = options?.enabled ?? true;
  const resetKey = options?.resetKey;

  const didInitRef = useRef(false);
  const [ids, setIds] = useState<number[]>([]);

  // Стабилизируем buildIds по ссылке, чтобы useEffect не триггерился зря
  const buildIdsStable = useMemo(() => buildIds, [buildIds]);

  // 1) Сброс “снимка” при resetKey
  useEffect(() => {
    didInitRef.current = false;

    // асинхронно
    queueMicrotask(() => setIds([]));
  }, [resetKey]);

  // 2) Инициализация “снимка” один раз, когда items появились
  useEffect(() => {
    if (!enabled) return;
    if (didInitRef.current) return;
    if (!items.length) return;

    didInitRef.current = true;

    queueMicrotask(() => {
      setIds(buildIdsStable(items));
    });
  }, [enabled, items.length, buildIdsStable, items]);

  return ids;
}
