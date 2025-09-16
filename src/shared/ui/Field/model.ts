import { Tile, TilesMatrix, TileType } from './types';

export const createTilesMatrix = (): TilesMatrix => {
  const tilesMatrix: TilesMatrix = [];

  for (let rowI = 0; rowI < 10; rowI++) {
    const row: Tile[] = [];

    for (let tileI = 0; tileI < 10; tileI++) {
      row.push({ type: TileType.virgin });
    }

    tilesMatrix.push(row);
  }

  return tilesMatrix;
};

export const getTileFromMatrixByPosition = (
  { x, y }: { x: number; y: number },
  matrix: TilesMatrix
): Tile => matrix[y][x];
