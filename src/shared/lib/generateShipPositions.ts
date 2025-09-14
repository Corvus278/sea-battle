import { ShipAxisPositionsList, ShipPosition } from '@/shared/types';

/**
 * Кораблей всего 10
 */

const createShip = (x: ShipAxisPositionsList, y: ShipAxisPositionsList): ShipPosition => {
  return {
    x,
    y,
  };
};

type Cell = { x: number; y: number };
type CellHash = `${number}-${number}`;

const createCellHash = (cell: Cell): CellHash => {
  return `${cell.x}-${cell.y}`;
};

const createCellFromHash = (hash: CellHash): Cell => {
  const [x, y] = hash.split('-').map(Number);
  return { x, y };
};

/**
 * Returns a random element from the array using crypto-secure randomness
 */
const getRandomElement = <T>(array: T[]): T => {
  const randomIndex = Math.floor(
    (crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * array.length
  );
  return array[randomIndex];
};

const emptyCellsTemplate: CellHash[] = (() => {
  const res: CellHash[] = [];

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      res.push(createCellHash({ x, y }));
    }
  }

  return res;
})();

const shipsSizesByOrder = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

type Direction = 'top' | 'bottom' | 'left' | 'right' | 'diagonal';
const allDirections: Direction[] = ['top', 'bottom', 'left', 'right', 'diagonal'];
const allShipsDirections: Direction[] = ['top', 'bottom', 'left', 'right'];

export const getCellsFromShip = (ship: ShipPosition): Cell[] => {
  return ship.x.flatMap((x) => {
    return ship.y.map((y) => {
      return { x, y };
    });
  });
};

export const generateShipPositions = (): ShipPosition[] => {
  const ships: ShipPosition[] = [];
  const emptyCellsHashesSet: Set<CellHash> = new Set(emptyCellsTemplate);

  const checkIsCellEmpty = (cell: Cell) => emptyCellsHashesSet.has(createCellHash(cell));

  const checkIsCellInField = (_cell: Cell) =>
    _cell.x >= 0 && _cell.x < 10 && _cell.y >= 0 && _cell.y < 10;

  const getRandomEmptyCell = () => {
    return createCellFromHash(getRandomElement(Array.from(emptyCellsHashesSet)));
  };

  const getNeighbourCells = (cell: Cell, direction: Direction, count: number) => {
    const cells: Cell[] = [];

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
          cells.push({ x: cell.x - i + 1, y: cell.y - i + 1 });
          // left bottom
          cells.push({ x: cell.x - i - 1, y: cell.y - i + 1 });
          // right top
          cells.push({ x: cell.x - i + 1, y: cell.y - i - 1 });
          break;
        }

        default:
          cells.push({ x: cell.x + i + 1, y: cell.y });
      }
    }

    return cells;
  };

  const getNeighbourCellsIfAllValid = (cell: Cell, direction: Direction, count: number) => {
    const cells = getNeighbourCells(cell, direction, count).filter((_cell) => {
      return checkIsCellEmpty(_cell) && checkIsCellInField(_cell);
    });

    if (cells.length !== count) {
      return [];
    }

    return cells;
  };

  const getAllPossibleDirectionsNeighbourCells = (cell: Cell, count: number) => {
    return allShipsDirections
      .map((direction) => getNeighbourCellsIfAllValid(cell, direction, count))
      .filter((cells) => cells.length);
  };

  const getShipCells = (size: number): Cell[] => {
    let timeoutCounter = 0;

    while (true) {
      timeoutCounter++;

      const startCell = getRandomEmptyCell();

      const restSize = size - 1;

      if (restSize === 0) {
        return [startCell];
      }

      const allPossibleDirectionsNeighbourCells = getAllPossibleDirectionsNeighbourCells(
        startCell,
        restSize
      );

      if (allPossibleDirectionsNeighbourCells.length) {
        return [startCell, ...getRandomElement(allPossibleDirectionsNeighbourCells)];
      }

      if (timeoutCounter > 10000) {
        throw new Error('Failed to generate ship, to more than 10000 tries');
      }
    }
  };

  const getShipFromCells = (shipCells: Cell[]) => {
    const getShipSellSeq = (
      cells: Cell[],
      getCoord: (cell: Cell) => number
    ): ShipAxisPositionsList => {
      if (cells[1] && getCoord(cells[0]) === getCoord(cells[1])) {
        return [getCoord(cells[0])];
      }

      return cells.map(getCoord).sort();
    };

    return createShip(
      getShipSellSeq(shipCells, (cell) => cell.x),
      getShipSellSeq(shipCells, (cell) => cell.y)
    );
  };

  const occupyCell = (cell: Cell) => emptyCellsHashesSet.delete(createCellHash(cell));

  const occupyCells = (cells: Cell[]) => cells.forEach(occupyCell);

  const occupyCellWithNeighbours = (cell: Cell) => {
    const cellWithNeighbours = [
      cell,
      ...allDirections.flatMap((direction) => {
        return getNeighbourCells(cell, direction, 1);
      }),
    ];

    occupyCells(cellWithNeighbours);
  };

  const occupyCellsForShip = (shipCells: Cell[]) => {
    shipCells.forEach(occupyCellWithNeighbours);
  };

  // ship creation loop
  shipsSizesByOrder.forEach((size) => {
    const shipCells = getShipCells(size);
    const ship = getShipFromCells(shipCells);
    occupyCellsForShip(shipCells);
    ships.push(ship);
  });

  return ships;
};
