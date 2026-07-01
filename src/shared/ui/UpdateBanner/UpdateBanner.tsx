'use client';

import { useEffect, useState } from 'react';
import { useSerwist } from '@serwist/turbopack/react';

/**
 * Баннер «доступна новая версия». Появляется, когда новый Service Worker перешёл
 * в состояние waiting (см. `skipWaiting: false` в src/app/sw.ts). Обновление
 * запускается только по клику пользователя — активная партия не обрывается молча.
 */
export function UpdateBanner() {
  const { serwist } = useSerwist();
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!serwist) return;

    const onWaiting = () => setUpdateAvailable(true);
    // Когда новый воркер получил управление после skip-waiting — перезагружаемся.
    const onControlling = () => window.location.reload();

    serwist.addEventListener('waiting', onWaiting);
    serwist.addEventListener('controlling', onControlling);

    return () => {
      serwist.removeEventListener('waiting', onWaiting);
      serwist.removeEventListener('controlling', onControlling);
    };
  }, [serwist]);

  if (!updateAvailable) return null;

  const handleUpdate = () => {
    // Просим waiting-воркер активироваться; reload произойдёт по событию controlling.
    serwist?.messageSkipWaiting();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-3 bg-teal-800 px-4 py-3 text-sm text-stone-100 shadow-lg">
      <span>Доступна новая версия</span>
      <button
        type="button"
        onClick={handleUpdate}
        className="rounded bg-stone-100 px-3 py-1 font-semibold text-stone-900 hover:bg-white"
      >
        Обновить
      </button>
    </div>
  );
}
