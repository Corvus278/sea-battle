'use client';

import { cn } from '@/shared/utils';

export type FiledProps = {};

export enum TileType {
  /**
   * На этой плитке уничтоженный корабль
   */
  destroyed,
  /**
   * На этой плитке повреждённый корабль
   */
  harmed,
  /**
   * По этой плитке стреляли, но она пуста
   */
  empty,
  /**
   * По этой плитке ещё не стреляли
   */
  virgin,
}
type Tile = {
  type: TileType;
};

const Tile = ({ tile }: { tile: Tile }) => {
  return (
    <button
      className={cn(
        'size-[40px]  border border-solid border-stone-900 shrink-0 cursor-pointer ',
        'transition-colors enabled:hover:bg-teal-600 disabled:cursor-default',
        {
          'bg-teal-800': tile.type === TileType.virgin,
          'bg-teal-600': tile.type === TileType.empty,
          'bg-red-500': tile.type === TileType.harmed,
          'bg-black': tile.type === TileType.destroyed,
        }
      )}
      disabled={tile.type !== TileType.virgin}
    />
  );
};

export const Filed = ({}: FiledProps) => {
  const tilesMatrix: Tile[][] = [];

  for (let rowI = 0; rowI < 10; rowI++) {
    const row: Tile[] = [];

    for (let tileI = 0; tileI < 10; tileI++) {
      if (rowI === 2 && tileI === 3) {
        row.push({ type: TileType.harmed });
        continue;
      }

      if (rowI === 3 && tileI === 3) {
        row.push({ type: TileType.empty });
        continue;
      }

      if (rowI === 4 && [4, 5, 6].includes(tileI)) {
        row.push({ type: TileType.destroyed });
        continue;
      }

      row.push({ type: TileType.virgin });
    }

    tilesMatrix.push(row);
  }

  console.debug(tilesMatrix);

  return (
    <div className={'size-[400px] flex flex-wrap'}>
      {tilesMatrix.map((tilesRow) => {
        return tilesRow.map((tile, i) => {
          return <Tile key={i} tile={tile} />;
        });
      })}
    </div>
  );
};
