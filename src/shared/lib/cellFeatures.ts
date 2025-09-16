import { PositionCell, PositionCellHash, Ship, ShipPosition } from '@/shared/types';

export type Direction = 'top' | 'bottom' | 'left' | 'right' | 'diagonal';
export const allDirections: Direction[] = ['top', 'bottom', 'left', 'right', 'diagonal'];

export const createCellHash = (cell: PositionCell): PositionCellHash => {
  return `${cell.x}-${cell.y}`;
};

export const createCellFromHash = (hash: PositionCellHash): PositionCell => {
  const [x, y] = hash.split('-').map(Number);
  return { x, y };
};

export const getCellsFromShipPosition = (shipPosition: ShipPosition): PositionCell[] => {
  return shipPosition.x.flatMap((x) => {
    return shipPosition.y.map((y) => {
      return { x, y };
    });
  });
};

export const getCellsFromShip = (ship: Ship): PositionCell[] => {
  return getCellsFromShipPosition(ship.position);
};

export const getNeighbourCells = (cell: PositionCell, direction: Direction, count: number) => {
  const cells: PositionCell[] = [];

  for (let i = 0; i < count; i++) {
    switch (direction) {
      case 'top': {
        cells.push({ x: cell.x, y: cell.y - i - 1 });
        break;
      }

      case 'bottom': {
        cells.push({ x: cell.x, y: cell.y + i + 1 });
        break;
      }

      case 'left': {
        cells.push({ x: cell.x - i - 1, y: cell.y });
        break;
      }

      case 'diagonal': {
        // left top
        cells.push({ x: cell.x - i - 1, y: cell.y - i - 1 });
        // right bottom
        cells.push({ x: cell.x + i + 1, y: cell.y + i + 1 });
        // left bottom
        cells.push({ x: cell.x - i - 1, y: cell.y + i + 1 });
        // right top
        cells.push({ x: cell.x + i + 1, y: cell.y - i - 1 });
        break;
      }

      default:
        cells.push({ x: cell.x + i + 1, y: cell.y });
    }
  }

  const checkIsCellInField = (_cell: PositionCell) =>
    _cell.x >= 0 && _cell.x < 10 && _cell.y >= 0 && _cell.y < 10;

  return cells.filter(checkIsCellInField);
};

export const getShipNeighbourCells = (ship: Ship, count = 1) => {
  const cells = getCellsFromShip(ship);
  const cellsSet = new Set(cells.map(createCellHash));
  const neighbourCells = cells.flatMap((cells) => {
    return allDirections.flatMap((direction) => getNeighbourCells(cells, direction, count));
  });

  // Удаляем ячейки, которые накладываются на ячейки корабля
  const neighbourCellsWithoutShipCells = neighbourCells.filter(
    (cell) => !cellsSet.has(createCellHash(cell))
  );

  // Убираем дубли
  return Array.from(new Set(neighbourCellsWithoutShipCells.map(createCellHash))).map(
    createCellFromHash
  );
};
