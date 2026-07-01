import { spawnSync } from 'node:child_process';
import { createSerwistRoute } from '@serwist/turbopack';

// Ревизия для versioned-инвалидации precache при деплое: хэш текущего коммита.
// Fallback на случай отсутствия git в окружении сборки.
const revision =
  spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' }).stdout?.trim() || `${Date.now()}`;

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute(
  {
    additionalPrecacheEntries: [{ url: '/~offline', revision }],
    swSrc: 'src/app/sw.ts',
    useNativeEsbuild: true,
    // Дефолтный target esbuild слишком старый (chrome64 и т.п.) и не умеет
    // понижать современный синтаксис Serwist. SW нужен только в браузерах с
    // поддержкой Service Worker — берём современный baseline.
    esbuildOptions: { target: 'es2020' },
  }
);
