# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## О проекте

«Морской бой» (Sea Battle) — веб-игра на Next.js 15 (App Router) + React 19 + TypeScript + Zustand + Tailwind CSS 4.
Поддерживает PvP-режим для двух игроков на одном экране (мобильная и десктопная версии).

Правила игры — см. `gameRules.md`: поле 10x10, флот из 1 четырёхпалубного, 2 трёхпалубных, 3 двухпалубных и 4
однопалубных кораблей (подлодок), попадание даёт дополнительный ход.

## Команды

```bash
npm run dev            # dev-сервер (Turbopack), http://localhost:3000
npm run build           # прод-сборка (Turbopack)
npm run start            # запуск прод-сборки
npm run lint             # ESLint
npm run test              # Jest, все тесты
npm run test:watch        # Jest в watch-режиме
npm run test:coverage      # Jest с отчётом покрытия (порог 70% по всем метрикам)
```

Один тестовый файл: `npx jest src/__tests__/generateShipPositions.test.ts`.

Husky pre-commit хук (`npm run pre-commit`) гоняет `test` и `lint-staged` (ESLint на `*.{js,mjs,jsx,ts,tsx}`, Prettier
на более широкий набор расширений).

## Архитектура

Код лежит в `src/`, организован по паттерну shared-first (мини-FSD):

- **`src/app`** — Next.js App Router. `page.tsx` — единственная страница, рендерит два `PlayerField` (поля игроков 1 и 2) внутри одного компонента `Home`.
- **`src/shared/store`** — единственный Zustand-стор (`useGameStore`), хранящий состояние обоих игроков (
  `shipsPositions`, `hitsPositions`, `isInitialized`), активного игрока (`activePlayer`) и победителя (`winner`). Собран
  через `combine` + `immer` + `devtools` middleware — мутации пишутся в императивном стиле благодаря immer.
- **`src/shared/types.ts`** — доменные типы: `ShipPosition` (корабль хранится не списком клеток, а как
  `{ x: number[], y: number[] }` — оси, по которым он занимает клетки), `HitPositionCell`, `Ship` (позиция + попадания),
  `Player`.
- **`src/shared/lib`** — чистые функции игровой логики, каждая с отдельным юнит-тестом в `src/__tests__`:
  - `generateShipPositions.ts` — рандомная расстановка флота с проверкой на пересечения и соседство (использует
    `crypto.getRandomValues`, не `Math.random`).
  - `cellFeatures.ts` — работа с клетками: хеширование (`x-y` строка) для Set/Map, получение соседних клеток по
    направлению (`top`/`bottom`/`left`/`right`/`diagonal`), получение клеток корабля и его соседей.
  - `checkIsHitOnShip.ts`, `applyHitsToShips.ts`, `checkIsShipsDestroyed.ts` — сопоставление выстрелов с кораблями и
    проверка поражения/победы.
- **`src/shared/ui/Field`** — компонент поля 10x10 (`Field.tsx`) и его модель (`model.ts` — построение `TilesMatrix`,
  `types.ts` — `TileType` enum: `virgin` / `virginNoEmpty` / `empty` / `harmed` / `destroyed`).
- **`src/shared/utils`** — общие утилиты (`cn` — обёртка над `clsx`/`tailwind-merge`).

### Игровой цикл

1. При маунте `Home` вызывает `initializeShips()` — генерирует расстановку кораблей для обоих игроков (если ещё не
   инициализированы).
2. Клик по клетке чужого поля → `addHit(hitPosition, forPlayer)` в сторе:
   - если стреляет не активный игрок — no-op;
   - попадание фиксируется в `hitsPositions` соответствующего игрока;
   - промах передаёт ход (`activePlayer = forPlayer`);
   - попадание хода не передаёт (доп. ход по правилам игры), и асинхронно (через `setTimeout`) пересчитывает, уничтожен
     ли флот — если да, выставляет `winner`.
3. `PlayerField` на каждый рендер пересобирает `TilesMatrix` из `shipsPositions` + `hitsPositions` (`addHitsToTiles` в
   `page.tsx`), определяя тип каждой клетки для отрисовки. Поле неактивного/выигравшего игрока показывает свои корабли (
   `needShowVirginNoEmpty`), активное поле противника кликабельно (`isActive`).

Важный нюанс домена: корабль на плоскости может быть горизонтальным, вертикальным или из одной клетки — это определяет,
какая из осей (`x` или `y`) в `ShipPosition` содержит несколько значений, а какая — одно.

## Пайплайн задачи (GitHub Flow + Vercel)

1. **Issue** — обязателен для любой задачи, заводится в GitHub Issues до начала работы.
2. **Ветка** от `master`, привязана к issue:

   ```
   feature/12-short-description
   fix/34-short-description
   ```

   Номер issue — в названии ветки.

3. **Разработка** — коммиты по Conventional Commits, с номером issue на отдельной строке:

   ```
   feat: add user avatar upload

   Refs #12
   ```

   ```
   fix: correct button alignment on mobile

   Closes #34
   ```

   `Closes #N` / `Fixes #N` — если коммит закрывает issue, `Refs #N` — если просто связан.

4. **Push** → Vercel автоматически поднимает Preview Deployment для ветки/PR.
5. **PR** в `master`:
   - заголовок — в conventional формате;
   - в описании — ссылка на issue (`Closes #12`) и Preview URL от Vercel.
6. **Ревью** — код + Preview-ссылка. Правки по комментариям — новые коммиты в ту же ветку, Preview обновляется.
7. **Merge** в `master` — обычный merge commit (без squash), сохраняется вся история коммитов ветки.
8. **Auto-deploy на прод** — Vercel деплоит `master` в Production сразу после мержа.
9. **Ветка удаляется** после мержа (issue закрывается автоматически, если был `Closes #N`).

# Правила

## Git

- не делай git add
- не делай git commit

## Контекст

- спрашивай, прежде чем сканировать репозиторий или соседние директории
- отвечай коротко, выделяй только важное, объясняй пунктами
- задавай вопросы, если есть сомнения или результат требует уточнения
- ищи пограничные случаи, которые могут сломать приложение, предлагай как с ними справляться
- используй markitdown (если доступен) для чтения не-md файлов без кода (pdf, docx, ppt и т.п.)
- используй семантический поиск и плагин context-mode
