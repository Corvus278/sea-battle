'use client';

import {
  createTilesMatrix,
  Field,
  getTileFromMatrixByPosition,
  TilesMatrix,
  TileType,
} from '@/shared/ui/Field';
import { useMemo, useEffect } from 'react';
import { HitPositionCell, ShipPosition } from '@/shared/types';
import { useGameStore } from '@/shared/store';
import { applyHitsToShips } from '@/shared/lib/applyHitsToShips';
import { getCellsFromShip, getShipNeighbourCells } from '@/shared/lib/cellFeatures';

const addHitsToTiles = (
  tiles: TilesMatrix,
  hitsPositions: HitPositionCell[],
  shipsPositions: ShipPosition[]
) => {
  const newTiles = [...tiles];
  const shipsWithHits = applyHitsToShips(shipsPositions, hitsPositions);

  // Наносим хиты на карту
  hitsPositions.forEach((hit) => {
    const tile = getTileFromMatrixByPosition(hit, newTiles);

    if (tile.type === TileType.virgin) {
      tile.type = TileType.empty;
      return;
    }
  });

  // Наносим корабли на карту
  shipsWithHits.forEach((ship) => {
    const { hits } = ship;
    const shipCells = getCellsFromShip(ship);

    // Корабль уничтожен
    if (hits.length === shipCells.length) {
      // Отображаем корабль
      shipCells.forEach((cell) => {
        const tile = getTileFromMatrixByPosition(cell, newTiles);
        tile.type = TileType.destroyed;
      });

      // Закрываем соседние кораблю ячейки
      const shipNeighboursCells = getShipNeighbourCells(ship);
      shipNeighboursCells.forEach((cell) => {
        const tile = getTileFromMatrixByPosition(cell, newTiles);
        tile.type = TileType.empty;
      });

      return;
    }

    // Корабль не уничтожен. Отображаем повреждённые части
    hits.forEach((hit) => {
      const tile = getTileFromMatrixByPosition(hit, newTiles);
      tile.type = TileType.harmed;
    });
  });

  return newTiles;
};

export default function Home() {
  const shipsPositions = useGameStore((state) => state.shipsPositions);
  const hitsPositions = useGameStore((state) => state.hitsPositions);
  const isInitialized = useGameStore((state) => state.isInitialized);
  const initializeShips = useGameStore((state) => state.initializeShips);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      initializeShips();
    }
  }, [initializeShips, isInitialized]);

  const tiles = useMemo(
    () => addHitsToTiles(createTilesMatrix(), hitsPositions, shipsPositions),
    [shipsPositions, hitsPositions]
  );

  if (!isInitialized) {
    return (
      <div className={'container flex justify-center items-center size-full flex-col'}>
        <h1 className={'mb-6 text-white text-3xl font-bold'}>Морской boy</h1>
        <div className="text-white">Загрузка игры...</div>
      </div>
    );
  }

  return (
    <div className={'container flex justify-center items-center size-full flex-col'}>
      <h1 className={'mb-6 text-white text-3xl font-bold'}>Морской boy</h1>
      <Field tilesMatrix={tiles} />
    </div>
  );
}
