'use client';

import { memo } from 'react';
import { cn } from '@/shared/utils';
import { type FiledProps, type Tile, type TileProps, TileType } from './types';

const Tile = memo(
  ({ tile, y, x, onHit, needShowVirginNoEmpty = false }: TileProps) => {
    return (
      <button
        className={cn(
          'border border-solid border-stone-900 shrink-0 cursor-pointer',
          'transition-colors enabled:hover:bg-teal-600 disabled:cursor-default',
          {
            'bg-teal-800':
              tile.type === TileType.virgin ||
              (tile.type === TileType.virginNoEmpty && !needShowVirginNoEmpty),
            'bg-teal-600': tile.type === TileType.empty,
            'bg-red-500': tile.type === TileType.harmed,
            'bg-black': tile.type === TileType.destroyed,
            'animate-tile-pulse': tile.type === TileType.virginNoEmpty && needShowVirginNoEmpty,
          }
        )}
        disabled={![TileType.virgin, TileType.virginNoEmpty].includes(tile.type)}
        onClick={() => {
          onHit({ x, y });
        }}
      />
    );
  },
  (prevProps, nextProps) =>
    prevProps.tile.type === nextProps.tile.type &&
    prevProps.x === nextProps.x &&
    prevProps.y === nextProps.y &&
    prevProps.onHit === nextProps.onHit &&
    prevProps.needShowVirginNoEmpty === nextProps.needShowVirginNoEmpty
);
Tile.displayName = 'Tile';

export const Field = ({
  tilesMatrix,
  onHit,
  isActive,
  needShowVirginNoEmpty = false,
}: FiledProps) => {
  return (
    <div
      className={cn(
        'size-[320px] min-[425px]:max-[708]:size-[370px] md:size-[346px] lg:size-[400px] grid transition pointer-events-none grid-cols-10 grid-rows-10',
        {
          'scale-[1.05] pointer-events-auto brightness-100': isActive,
        }
      )}
    >
      {tilesMatrix.map((tilesRow, rowIdx) => {
        return tilesRow.map((tile, tileIdx) => {
          return (
            <Tile
              tile={tile}
              x={tileIdx}
              y={rowIdx}
              onHit={onHit}
              key={`${tileIdx}-${tile.type}`}
              needShowVirginNoEmpty={needShowVirginNoEmpty}
            />
          );
        });
      })}
    </div>
  );
};
