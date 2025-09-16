'use client';

import { Fragment } from 'react';
import { cn } from '@/shared/utils';
import { type FiledProps, type Tile, type TileProps, TileType } from './types';
import { useGameStore } from '@/shared/store';

const Tile = ({ tile, y, x }: TileProps) => {
  const addHit = useGameStore((state) => state.addHit);

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
      onClick={() => {
        addHit({ x, y });
      }}
    />
  );
};

export const Field = ({ tilesMatrix }: FiledProps) => {
  return (
    <div className={'size-[440px] flex flex-wrap'}>
      <div className={'size-[40px] text-white flex justify-center items-center'}></div>

      {tilesMatrix[0].map((_, i) => {
        return (
          <div
            key={`indexColumn-${i}`}
            className={'size-[40px] text-white flex justify-center items-center'}
          >
            {i}
          </div>
        );
      })}

      {tilesMatrix.map((tilesRow, rowIdx) => {
        return (
          <div className={'flex'} key={`row-${rowIdx}`}>
            {tilesRow.map((tile, tileIdx) => {
              return (
                <Fragment key={`${tileIdx}-${tile.type}`}>
                  {tileIdx === 0 && (
                    <div
                      key={'index'}
                      className={'size-[40px] text-white flex justify-center items-center'}
                    >
                      {rowIdx}
                    </div>
                  )}

                  <Tile tile={tile} x={tileIdx} y={rowIdx} key={`tile-${rowIdx}-${tileIdx}`} />
                </Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
