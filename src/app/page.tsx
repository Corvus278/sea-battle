'use client';

import {
  createTilesMatrix,
  Field,
  getTileFromMatrixByPosition,
  TilesMatrix,
  TileType,
} from '@/shared/ui/Field';
import { useMemo, useEffect, useCallback } from 'react';
import { HitPositionCell, Player, ShipPosition } from '@/shared/types';
import { useGameStore } from '@/shared/store';
import { applyHitsToShips } from '@/shared/lib/applyHitsToShips';
import { getCellsFromShip, getShipNeighbourCells } from '@/shared/lib/cellFeatures';
import { checkIsShipDestroyed } from '@/shared/lib/checkIsShipsDestroyed';

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

    // Отмечаем корабль на карте
    shipCells.forEach((cell) => {
      const tile = getTileFromMatrixByPosition(cell, newTiles);
      tile.type = TileType.virginNoEmpty;
    });

    // Корабль уничтожен
    if (checkIsShipDestroyed(ship)) {
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

const PlayerField = ({ playerId }: { playerId: Player['id'] }) => {
  const shipsPositions = useGameStore((state) => state[playerId].shipsPositions);
  const hitsPositions = useGameStore((state) => state[playerId].hitsPositions);
  const isInitialized = useGameStore((state) => state[playerId].isInitialized);
  const activePlayer = useGameStore((state) => state.activePlayer);
  const addHit = useGameStore((state) => state.addHit);
  const winner = useGameStore((state) => state.winner);
  const isWinner = winner === playerId;
  const hasWinner = Boolean(winner);

  const tiles = useMemo(
    () => addHitsToTiles(createTilesMatrix(), hitsPositions, shipsPositions),
    [shipsPositions, hitsPositions]
  );
  const handleHit = useCallback(
    (hitPosition: HitPositionCell) => {
      addHit(hitPosition, playerId);
    },
    [addHit, playerId]
  );

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center size-[400px]">
        <p className="text-white">Загрузка игры...</p>
      </div>
    );
  }

  return (
    <Field
      tilesMatrix={tiles}
      onHit={handleHit}
      isActive={activePlayer !== playerId && !hasWinner}
      needShowVirginNoEmpty={isWinner}
    />
  );
};

export default function Home() {
  const initializeShips = useGameStore((state) => state.initializeShips);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeShips();
    }
  }, [initializeShips]);

  return (
    <div className={'container mx-auto flex justify-center items-center size-full flex-col'}>
      <h1 className={'mb-10 text-white text-3xl font-bold font-mono'}>Морской boy</h1>
      <div className={'flex justify-center items-center gap-8'}>
        <PlayerField playerId={1} />
        <PlayerField playerId={2} />
      </div>
    </div>
  );
}
