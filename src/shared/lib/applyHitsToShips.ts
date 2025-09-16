import { HitPositionCell, Ship, ShipPosition } from '@/shared/types';
import { createCellHash, getCellsFromShipPosition } from '@/shared/lib/cellFeatures';

export const applyHitsToShips = (
  shipPositions: ShipPosition[],
  hitsPositions: HitPositionCell[]
) => {
  const hitsSet = new Set(hitsPositions.map((hit) => createCellHash(hit)));
  const ships: Ship[] = [];

  shipPositions.forEach((shipPosition) => {
    const shipCells = getCellsFromShipPosition(shipPosition);
    const hits: HitPositionCell[] = shipCells.filter((cell) => hitsSet.has(createCellHash(cell)));

    ships.push({
      position: shipPosition,
      hits,
    });
  });

  return ships;
};
