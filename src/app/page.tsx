'use client';

import { Filed, Tile, TileType } from '@/shared/ui/Filed';
import { useMemo } from 'react';
import { generateShipPositions, getCellsFromShip } from '@/shared/lib/generateShipPositions';
import { ShipPosition } from '@/shared/types';

const mapShipsToTiles = (ships: ShipPosition[]): Tile[][] => {
  const tilesMatrix: Tile[][] = [];

  for (let rowI = 0; rowI < 10; rowI++) {
    const row: Tile[] = [];

    for (let tileI = 0; tileI < 10; tileI++) {
      // console.debug('{ type: TileType.virgin }', { type: TileType.virgin });
      row.push({ type: TileType.virgin });
    }

    tilesMatrix.push(row);
    // console.debug('2', JSON.stringify(tilesMatrix));
  }

  ships.forEach((ship) => {
    const shipCells = getCellsFromShip(ship);

    shipCells.forEach((cell) => {
      tilesMatrix[cell.y][cell.x].type = TileType.destroyed;
    });
  });

  return tilesMatrix;
};

export default function Home() {
  const tiles = useMemo(() => mapShipsToTiles(generateShipPositions()), []);

  return (
    <div className={'container flex justify-center items-center size-full flex-col'}>
      <h1 className={'mb-6 text-white text-3xl font-bold'}>Морской boy</h1>

      <Filed tilesMatrix={tiles} />
    </div>
  );
}
