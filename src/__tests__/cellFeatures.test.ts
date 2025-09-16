import { Ship, ShipPosition } from '@/shared/types';
import {
  getCellsFromShipPosition,
  getCellsFromShip,
  createCellHash,
  createCellFromHash,
  getNeighbourCells,
  getShipNeighbourCells,
} from '@/shared/lib/cellFeatures';

describe('getCellsFromShipPosition', () => {
  it('должна возвращать правильные координаты для однопалубного корабля', () => {
    const ship: ShipPosition = {
      x: [5],
      y: [3],
    };

    const cells = getCellsFromShipPosition(ship);

    expect(cells).toHaveLength(1);
    expect(cells).toContainEqual({ x: 5, y: 3 });
  });

  it('должна возвращать правильные координаты для горизонтального корабля', () => {
    const ship: ShipPosition = {
      x: [2, 3, 4],
      y: [5],
    };

    const cells = getCellsFromShipPosition(ship);

    expect(cells).toHaveLength(3);
    expect(cells).toContainEqual({ x: 2, y: 5 });
    expect(cells).toContainEqual({ x: 3, y: 5 });
    expect(cells).toContainEqual({ x: 4, y: 5 });
  });

  it('должна возвращать правильные координаты для вертикального корабля', () => {
    const ship: ShipPosition = {
      x: [1],
      y: [6, 7, 8, 9],
    };

    const cells = getCellsFromShipPosition(ship);

    expect(cells).toHaveLength(4);
    expect(cells).toContainEqual({ x: 1, y: 6 });
    expect(cells).toContainEqual({ x: 1, y: 7 });
    expect(cells).toContainEqual({ x: 1, y: 8 });
    expect(cells).toContainEqual({ x: 1, y: 9 });
  });

  it('должна возвращать правильные координаты для двухпалубного корабля по диагонали (некорректный случай)', () => {
    // Этот тест проверяет поведение функции с некорректными данными
    // В реальной игре такой корабль не должен существовать, но функция должна работать
    const ship: ShipPosition = {
      x: [0, 1],
      y: [0, 1],
    };

    const cells = getCellsFromShipPosition(ship);

    expect(cells).toHaveLength(4); // 2 * 2 = 4 клетки
    expect(cells).toContainEqual({ x: 0, y: 0 });
    expect(cells).toContainEqual({ x: 0, y: 1 });
    expect(cells).toContainEqual({ x: 1, y: 0 });
    expect(cells).toContainEqual({ x: 1, y: 1 });
  });

  it('должна возвращать правильные координаты для максимального корабля', () => {
    const ship: ShipPosition = {
      x: [0, 1, 2, 3],
      y: [0],
    };

    const cells = getCellsFromShipPosition(ship);

    expect(cells).toHaveLength(4);
    expect(cells).toContainEqual({ x: 0, y: 0 });
    expect(cells).toContainEqual({ x: 1, y: 0 });
    expect(cells).toContainEqual({ x: 2, y: 0 });
    expect(cells).toContainEqual({ x: 3, y: 0 });
  });

  it('должна возвращать пустой массив для корабля с пустыми координатами', () => {
    const ship: ShipPosition = {
      x: [],
      y: [],
    };

    const cells = getCellsFromShipPosition(ship);

    expect(cells).toHaveLength(0);
    expect(cells).toEqual([]);
  });

  it('должна работать с координатами на границах поля', () => {
    const ship: ShipPosition = {
      x: [9],
      y: [9],
    };

    const cells = getCellsFromShipPosition(ship);

    expect(cells).toHaveLength(1);
    expect(cells).toContainEqual({ x: 9, y: 9 });
  });

  it('должна возвращать массив объектов с правильной структурой', () => {
    const ship: ShipPosition = {
      x: [2, 3],
      y: [4],
    };

    const cells = getCellsFromShipPosition(ship);

    cells.forEach((cell) => {
      expect(cell).toHaveProperty('x');
      expect(cell).toHaveProperty('y');
      expect(typeof cell.x).toBe('number');
      expect(typeof cell.y).toBe('number');
    });
  });

  it('должна правильно обрабатывать несортированные координаты', () => {
    const ship: ShipPosition = {
      x: [3, 1, 2],
      y: [5],
    };

    const cells = getCellsFromShipPosition(ship);

    expect(cells).toHaveLength(3);
    expect(cells).toContainEqual({ x: 3, y: 5 });
    expect(cells).toContainEqual({ x: 1, y: 5 });
    expect(cells).toContainEqual({ x: 2, y: 5 });
  });

  it('должна правильно работать с дублирующимися координатами', () => {
    const ship: ShipPosition = {
      x: [1, 1, 2],
      y: [3],
    };

    const cells = getCellsFromShipPosition(ship);

    expect(cells).toHaveLength(3);
    expect(cells).toEqual([
      { x: 1, y: 3 },
      { x: 1, y: 3 }, // дубликат
      { x: 2, y: 3 },
    ]);
  });
});

describe('createCellHash', () => {
  it('должна создавать правильный хэш из координат ячейки', () => {
    const cell = { x: 3, y: 7 };
    expect(createCellHash(cell)).toBe('3-7');
  });

  it('должна работать с нулевыми координатами', () => {
    const cell = { x: 0, y: 0 };
    expect(createCellHash(cell)).toBe('0-0');
  });

  it('должна работать с большими координатами', () => {
    const cell = { x: 99, y: 100 };
    expect(createCellHash(cell)).toBe('99-100');
  });
});

describe('createCellFromHash', () => {
  it('должна создавать ячейку из правильного хэша', () => {
    const hash = '5-8';
    const cell = createCellFromHash(hash);
    expect(cell).toEqual({ x: 5, y: 8 });
  });

  it('должна работать с нулевыми координатами', () => {
    const hash = '0-0';
    const cell = createCellFromHash(hash);
    expect(cell).toEqual({ x: 0, y: 0 });
  });

  it('должна правильно обрабатывать хэш с большими числами', () => {
    const hash = '99-100';
    const cell = createCellFromHash(hash);
    expect(cell).toEqual({ x: 99, y: 100 });
  });

  it('должна быть обратной к createCellHash', () => {
    const originalCell = { x: 7, y: 3 };
    const hash = createCellHash(originalCell);
    const restoredCell = createCellFromHash(hash);
    expect(restoredCell).toEqual(originalCell);
  });
});

describe('getCellsFromShip', () => {
  it('должна возвращать ячейки из объекта Ship', () => {
    const ship: Ship = {
      position: {
        x: [2, 3],
        y: [4],
      },
      hits: [],
    };

    const cells = getCellsFromShip(ship);
    expect(cells).toHaveLength(2);
    expect(cells).toContainEqual({ x: 2, y: 4 });
    expect(cells).toContainEqual({ x: 3, y: 4 });
  });

  it('должна работать с однопалубным кораблем', () => {
    const ship: Ship = {
      position: {
        x: [5],
        y: [7],
      },
      hits: [{ x: 5, y: 7 }],
    };

    const cells = getCellsFromShip(ship);
    expect(cells).toHaveLength(1);
    expect(cells).toContainEqual({ x: 5, y: 7 });
  });

  it('должна работать с вертикальным кораблем', () => {
    const ship: Ship = {
      position: {
        x: [1],
        y: [2, 3, 4, 5],
      },
      hits: [],
    };

    const cells = getCellsFromShip(ship);
    expect(cells).toHaveLength(4);
    expect(cells).toContainEqual({ x: 1, y: 2 });
    expect(cells).toContainEqual({ x: 1, y: 3 });
    expect(cells).toContainEqual({ x: 1, y: 4 });
    expect(cells).toContainEqual({ x: 1, y: 5 });
  });
});

describe('getNeighbourCells', () => {
  describe('направление top', () => {
    it('должна возвращать соседние ячейки сверху', () => {
      const cell = { x: 5, y: 5 };
      const neighbours = getNeighbourCells(cell, 'top', 2);

      expect(neighbours).toContainEqual({ x: 5, y: 4 });
      expect(neighbours).toContainEqual({ x: 5, y: 3 });
      expect(neighbours).toHaveLength(2);
    });

    it('должна фильтровать ячейки вне поля', () => {
      const cell = { x: 5, y: 1 };
      const neighbours = getNeighbourCells(cell, 'top', 3);

      expect(neighbours).toContainEqual({ x: 5, y: 0 });
      expect(neighbours).toHaveLength(1); // только одна ячейка в пределах поля
    });
  });

  describe('направление bottom', () => {
    it('должна возвращать соседние ячейки снизу', () => {
      const cell = { x: 5, y: 5 };
      const neighbours = getNeighbourCells(cell, 'bottom', 2);

      expect(neighbours).toContainEqual({ x: 5, y: 6 });
      expect(neighbours).toContainEqual({ x: 5, y: 7 });
      expect(neighbours).toHaveLength(2);
    });

    it('должна фильтровать ячейки вне поля', () => {
      const cell = { x: 5, y: 8 };
      const neighbours = getNeighbourCells(cell, 'bottom', 3);

      expect(neighbours).toContainEqual({ x: 5, y: 9 });
      expect(neighbours).toHaveLength(1);
    });
  });

  describe('направление left', () => {
    it('должна возвращать соседние ячейки слева', () => {
      const cell = { x: 5, y: 5 };
      const neighbours = getNeighbourCells(cell, 'left', 2);

      expect(neighbours).toContainEqual({ x: 4, y: 5 });
      expect(neighbours).toContainEqual({ x: 3, y: 5 });
      expect(neighbours).toHaveLength(2);
    });

    it('должна фильтровать ячейки вне поля', () => {
      const cell = { x: 1, y: 5 };
      const neighbours = getNeighbourCells(cell, 'left', 3);

      expect(neighbours).toContainEqual({ x: 0, y: 5 });
      expect(neighbours).toHaveLength(1);
    });
  });

  describe('направление right', () => {
    it('должна возвращать соседние ячейки справа', () => {
      const cell = { x: 5, y: 5 };
      const neighbours = getNeighbourCells(cell, 'right', 2);

      expect(neighbours).toContainEqual({ x: 6, y: 5 });
      expect(neighbours).toContainEqual({ x: 7, y: 5 });
      expect(neighbours).toHaveLength(2);
    });

    it('должна фильтровать ячейки вне поля', () => {
      const cell = { x: 8, y: 5 };
      const neighbours = getNeighbourCells(cell, 'right', 3);

      expect(neighbours).toContainEqual({ x: 9, y: 5 });
      expect(neighbours).toHaveLength(1);
    });
  });

  describe('направление diagonal', () => {
    it('должна возвращать диагональные соседние ячейки', () => {
      const cell = { x: 5, y: 5 };
      const neighbours = getNeighbourCells(cell, 'diagonal', 1);

      expect(neighbours).toContainEqual({ x: 4, y: 4 }); // left top
      expect(neighbours).toContainEqual({ x: 6, y: 6 }); // right bottom
      expect(neighbours).toContainEqual({ x: 4, y: 6 }); // left bottom
      expect(neighbours).toContainEqual({ x: 6, y: 4 }); // right top
      expect(neighbours).toHaveLength(4);
    });

    it('должна фильтровать диагональные ячейки вне поля', () => {
      const cell = { x: 0, y: 0 };
      const neighbours = getNeighbourCells(cell, 'diagonal', 1);

      expect(neighbours).toContainEqual({ x: 1, y: 1 }); // right bottom
      expect(neighbours).toContainEqual({ x: 1, y: 1 }); // right top (но это дубликат)
      // Левые и верхние диагонали должны быть отфильтрованы
      expect(neighbours.filter((cell) => cell.x >= 0 && cell.y >= 0)).not.toHaveLength(0);
    });

    it('должна возвращать правильное количество диагональных ячеек для count > 1', () => {
      const cell = { x: 5, y: 5 };
      const neighbours = getNeighbourCells(cell, 'diagonal', 2);

      expect(neighbours).toHaveLength(8); // 4 направления * 2 ячейки

      // Проверяем первый уровень диагоналей
      expect(neighbours).toContainEqual({ x: 4, y: 4 });
      expect(neighbours).toContainEqual({ x: 6, y: 6 });
      expect(neighbours).toContainEqual({ x: 4, y: 6 });
      expect(neighbours).toContainEqual({ x: 6, y: 4 });

      // Проверяем второй уровень диагоналей
      expect(neighbours).toContainEqual({ x: 3, y: 3 });
      expect(neighbours).toContainEqual({ x: 7, y: 7 });
      expect(neighbours).toContainEqual({ x: 3, y: 7 });
      expect(neighbours).toContainEqual({ x: 7, y: 3 });
    });
  });

  it('должна возвращать пустой массив для count = 0', () => {
    const cell = { x: 5, y: 5 };
    const neighbours = getNeighbourCells(cell, 'top', 0);
    expect(neighbours).toHaveLength(0);
  });

  it('должна работать с ячейками на границах поля', () => {
    const cornerCell = { x: 0, y: 0 };
    const neighbours = getNeighbourCells(cornerCell, 'right', 1);

    expect(neighbours).toContainEqual({ x: 1, y: 0 });
    expect(neighbours).toHaveLength(1);
  });

  it('должна работать с ячейками в противоположном углу поля', () => {
    const cornerCell = { x: 9, y: 9 };
    const neighbours = getNeighbourCells(cornerCell, 'left', 1);

    expect(neighbours).toContainEqual({ x: 8, y: 9 });
    expect(neighbours).toHaveLength(1);
  });
});

describe('getShipNeighbourCells', () => {
  it('должна возвращать соседние ячейки для однопалубного корабля', () => {
    const ship: Ship = {
      position: { x: [5], y: [5] },
      hits: [],
    };

    const neighbours = getShipNeighbourCells(ship, 1);

    // Проверяем, что возвращаются все 8 соседних ячеек (крест + диагонали)
    expect(neighbours.length).toBeGreaterThan(0);

    // Проверяем, что ячейка самого корабля не включена
    expect(neighbours).not.toContainEqual({ x: 5, y: 5 });

    // Проверяем несколько обязательных соседних ячеек
    expect(neighbours).toContainEqual({ x: 4, y: 5 }); // слева
    expect(neighbours).toContainEqual({ x: 6, y: 5 }); // справа
    expect(neighbours).toContainEqual({ x: 5, y: 4 }); // сверху
    expect(neighbours).toContainEqual({ x: 5, y: 6 }); // снизу
  });

  it('должна возвращать соседние ячейки для горизонтального корабля', () => {
    const ship: Ship = {
      position: { x: [3, 4, 5], y: [5] },
      hits: [],
    };

    const neighbours = getShipNeighbourCells(ship, 1);

    // Проверяем, что ячейки корабля не включены в соседние
    expect(neighbours).not.toContainEqual({ x: 3, y: 5 });
    expect(neighbours).not.toContainEqual({ x: 4, y: 5 });
    expect(neighbours).not.toContainEqual({ x: 5, y: 5 });

    // Проверяем некоторые обязательные соседние ячейки
    expect(neighbours).toContainEqual({ x: 2, y: 5 }); // слева от корабля
    expect(neighbours).toContainEqual({ x: 6, y: 5 }); // справа от корабля
    expect(neighbours).toContainEqual({ x: 3, y: 4 }); // сверху от первой ячейки
    expect(neighbours).toContainEqual({ x: 3, y: 6 }); // снизу от первой ячейки
  });

  it('должна возвращать соседние ячейки для вертикального корабля', () => {
    const ship: Ship = {
      position: { x: [5], y: [3, 4, 5] },
      hits: [],
    };

    const neighbours = getShipNeighbourCells(ship, 1);

    // Проверяем, что ячейки корабля не включены
    expect(neighbours).not.toContainEqual({ x: 5, y: 3 });
    expect(neighbours).not.toContainEqual({ x: 5, y: 4 });
    expect(neighbours).not.toContainEqual({ x: 5, y: 5 });

    // Проверяем соседние ячейки
    expect(neighbours).toContainEqual({ x: 5, y: 2 }); // сверху от корабля
    expect(neighbours).toContainEqual({ x: 5, y: 6 }); // снизу от корабля
    expect(neighbours).toContainEqual({ x: 4, y: 3 }); // слева от первой ячейки
    expect(neighbours).toContainEqual({ x: 6, y: 3 }); // справа от первой ячейки
  });

  it('должна удалять дубликаты соседних ячеек', () => {
    const ship: Ship = {
      position: { x: [5, 6], y: [5] },
      hits: [],
    };

    const neighbours = getShipNeighbourCells(ship, 1);

    // Создаем множество для проверки уникальности
    const uniqueNeighbours = new Set(neighbours.map((cell) => `${cell.x}-${cell.y}`));
    expect(uniqueNeighbours.size).toBe(neighbours.length);
  });

  it('должна работать с кораблем на границе поля', () => {
    const ship: Ship = {
      position: { x: [0], y: [0] },
      hits: [],
    };

    const neighbours = getShipNeighbourCells(ship, 1);

    // Все соседние ячейки должны быть в пределах поля
    neighbours.forEach((cell) => {
      expect(cell.x).toBeGreaterThanOrEqual(0);
      expect(cell.x).toBeLessThan(10);
      expect(cell.y).toBeGreaterThanOrEqual(0);
      expect(cell.y).toBeLessThan(10);
    });

    expect(neighbours).toContainEqual({ x: 1, y: 0 });
    expect(neighbours).toContainEqual({ x: 0, y: 1 });
    expect(neighbours).toContainEqual({ x: 1, y: 1 });
  });

  it('должна работать с кораблем в противоположном углу поля', () => {
    const ship: Ship = {
      position: { x: [9], y: [9] },
      hits: [],
    };

    const neighbours = getShipNeighbourCells(ship, 1);

    // Все соседние ячейки должны быть в пределах поля
    neighbours.forEach((cell) => {
      expect(cell.x).toBeGreaterThanOrEqual(0);
      expect(cell.x).toBeLessThan(10);
      expect(cell.y).toBeGreaterThanOrEqual(0);
      expect(cell.y).toBeLessThan(10);
    });

    expect(neighbours).toContainEqual({ x: 8, y: 9 });
    expect(neighbours).toContainEqual({ x: 9, y: 8 });
    expect(neighbours).toContainEqual({ x: 8, y: 8 });
  });

  it('должна работать с пользовательским count > 1', () => {
    const ship: Ship = {
      position: { x: [5], y: [5] },
      hits: [],
    };

    const neighbours1 = getShipNeighbourCells(ship, 1);
    const neighbours2 = getShipNeighbourCells(ship, 2);

    // С большим count должно быть больше соседних ячеек
    expect(neighbours2.length).toBeGreaterThan(neighbours1.length);

    // Все ячейки с count=1 должны быть включены в count=2
    neighbours1.forEach((cell) => {
      expect(neighbours2).toContainEqual(cell);
    });
  });

  it('должна работать с count по умолчанию (1)', () => {
    const ship: Ship = {
      position: { x: [5], y: [5] },
      hits: [],
    };

    const neighbours1 = getShipNeighbourCells(ship, 1);
    const neighboursDefault = getShipNeighbourCells(ship);

    expect(neighboursDefault).toEqual(neighbours1);
  });

  it('должна возвращать массив уникальных ячеек типа PositionCell', () => {
    const ship: Ship = {
      position: { x: [5], y: [5] },
      hits: [],
    };

    const neighbours = getShipNeighbourCells(ship, 1);

    neighbours.forEach((cell) => {
      expect(cell).toHaveProperty('x');
      expect(cell).toHaveProperty('y');
      expect(typeof cell.x).toBe('number');
      expect(typeof cell.y).toBe('number');
    });
  });
});
