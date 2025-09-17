import { HitPositionCell, ShipPosition } from '@/shared/types';
import { compareCells, getCellsFromShipPosition } from '@/shared/lib/cellFeatures';

export const checkIsHitOnShip = (shipPosition: ShipPosition, hit: HitPositionCell) => {
  return getCellsFromShipPosition(shipPosition).some((cell) => compareCells(cell, hit));
};
