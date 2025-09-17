export enum TileType {
  /**
   * По этой плитке ещё не стреляли
   */
  virgin,
  /**
  /**
   * По этой плитке стреляли, но она пуста
   */
  empty,
  /**
   * На этой плитке повреждённый корабль
   */
  harmed,
  /**
   * На этой плитке уничтоженный корабль
   */
  destroyed,
}

type OnHit = ({}: { x: number; y: number }) => void;

export type TileProps = {
  tile: Tile;
  x: number;
  y: number;
  onHit: OnHit;
};

export type Tile = {
  type: TileType;
};

export type TilesMatrix = Tile[][];

export type FiledProps = {
  tilesMatrix: TilesMatrix;
  onHit: OnHit;
};
