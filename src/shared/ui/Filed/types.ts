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

export type FiledProps = {
  tilesMatrix: Tile[][];
};

export type Tile = {
  type: TileType;
};
