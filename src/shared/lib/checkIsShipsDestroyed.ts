import { Ship } from '@/shared/types';

export const checkIsShipDestroyed = (ship: Ship) => {
  return ship.hits.length === Math.max(ship.position.y.length, ship.position.x.length);
};

export const checkIsShipsDestroyed = (ships: Ship[]) => {
  return ships.filter(checkIsShipDestroyed).length === ships.length;
};
