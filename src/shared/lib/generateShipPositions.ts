import {
  PositionCell,
  PositionCellHash,
  ShipAxisPositionsList,
  ShipPosition,
} from '@/shared/types';
import {
  allDirections,
  createCellFromHash,
  createCellHash,
  Direction,
  getNeighbourCells,
} from '@/shared/lib/cellFeatures';

/**
 * Кораблей всего 10
 */

const createShip = (x: ShipAxisPositionsList, y: ShipAxisPositionsList): ShipPosition => {
  return {
    x,
    y,
  };
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

const emptyCellsTemplate: PositionCellHash[] = (() => {
  const res: PositionCellHash[] = [];

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      res.push(createCellHash({ x, y }));
    }
  }

  return res;
})();

const shipsSizesByOrder = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

const allShipsDirections: Direction[] = ['top', 'bottom', 'left', 'right'];

export const generateShipPositions = (): ShipPosition[] => {
  const ships: ShipPosition[] = [];
  const emptyCellsHashesSet: Set<PositionCellHash> = new Set(emptyCellsTemplate);

  const checkIsCellEmpty = (cell: PositionCell) => emptyCellsHashesSet.has(createCellHash(cell));

  const getRandomEmptyCell = () => {
    return createCellFromHash(getRandomElement(Array.from(emptyCellsHashesSet)));
  };

  const getNeighbourCellsIfAllValid = (cell: PositionCell, direction: Direction, count: number) => {
    const cells = getNeighbourCells(cell, direction, count).filter((_cell) => {
      return checkIsCellEmpty(_cell);
    });

    if (cells.length !== count) {
      return [];
    }

    return cells;
  };

  const getAllPossibleDirectionsNeighbourCells = (cell: PositionCell, count: number) => {
    return allShipsDirections
      .map((direction) => getNeighbourCellsIfAllValid(cell, direction, count))
      .filter((cells) => cells.length);
  };

  const getShipCells = (size: number): PositionCell[] => {
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

  const getShipFromCells = (shipCells: PositionCell[]) => {
    const getShipSellSeq = (
      cells: PositionCell[],
      getCoord: (cell: PositionCell) => number
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

  const occupyCell = (cell: PositionCell) => emptyCellsHashesSet.delete(createCellHash(cell));

  const occupyCells = (cells: PositionCell[]) => cells.forEach(occupyCell);

  const occupyCellWithNeighbours = (cell: PositionCell) => {
    const cellWithNeighbours = [
      cell,
      ...allDirections.flatMap((direction) => {
        return getNeighbourCells(cell, direction, 1);
      }),
    ];

    occupyCells(cellWithNeighbours);
  };

  const occupyCellsForShip = (shipCells: PositionCell[]) => {
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
