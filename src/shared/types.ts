/**
 * Базовая ячейка позиции
 */
export type PositionCell = { x: number; y: number };
export type PositionCellHash = `${number}-${number}`;

/**
 * По одной оси корабль занимает минимум 1 клетку, максимиум - 4 (ограничения размеров кораблей)
 */
export type ShipAxisPositionsList = number[];
// | [number]
// | [number, number]
// | [number, number, number]
// | [number, number, number, number];

/**
 * Позиция корабля
 */
export type ShipPosition = {
  /**
   * Список клеток, которые корабль занимает по оси x
   */
  x: ShipAxisPositionsList;
  /**
   * Список клеток, которые корабль занимает по оси y
   */
  y: ShipAxisPositionsList;
};

/**
 * Позиция попадания
 * */
export type HitPositionCell = {
  x: number;
  y: number;
};

export type Ship = {
  position: ShipPosition;
  hits: HitPositionCell[];
};

export type Player = {
  id: 1 | 2;
};
