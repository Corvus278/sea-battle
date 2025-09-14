/**
 * Тесты для функции generateShipPositions и вспомогательных функций
 */

import { generateShipPositions, getCellsFromShip } from '@/shared/lib/generateShipPositions';
import { ShipPosition } from '@/shared/types';

describe('getCellsFromShip', () => {
  it('должна возвращать правильные координаты для однопалубного корабля', () => {
    const ship: ShipPosition = {
      x: [5],
      y: [3],
    };

    const cells = getCellsFromShip(ship);

    expect(cells).toHaveLength(1);
    expect(cells).toContainEqual({ x: 5, y: 3 });
  });

  it('должна возвращать правильные координаты для горизонтального корабля', () => {
    const ship: ShipPosition = {
      x: [2, 3, 4],
      y: [5],
    };

    const cells = getCellsFromShip(ship);

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

    const cells = getCellsFromShip(ship);

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

    const cells = getCellsFromShip(ship);

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

    const cells = getCellsFromShip(ship);

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

    const cells = getCellsFromShip(ship);

    expect(cells).toHaveLength(0);
    expect(cells).toEqual([]);
  });

  it('должна работать с координатами на границах поля', () => {
    const ship: ShipPosition = {
      x: [9],
      y: [9],
    };

    const cells = getCellsFromShip(ship);

    expect(cells).toHaveLength(1);
    expect(cells).toContainEqual({ x: 9, y: 9 });
  });

  it('должна работать с отрицательными координатами (граничный случай)', () => {
    const ship: ShipPosition = {
      x: [-1, 0],
      y: [0],
    };

    const cells = getCellsFromShip(ship);

    expect(cells).toHaveLength(2);
    expect(cells).toContainEqual({ x: -1, y: 0 });
    expect(cells).toContainEqual({ x: 0, y: 0 });
  });

  it('должна возвращать массив объектов с правильной структурой', () => {
    const ship: ShipPosition = {
      x: [2, 3],
      y: [4],
    };

    const cells = getCellsFromShip(ship);

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

    const cells = getCellsFromShip(ship);

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

    const cells = getCellsFromShip(ship);

    expect(cells).toHaveLength(3);
    expect(cells).toEqual([
      { x: 1, y: 3 },
      { x: 1, y: 3 }, // дубликат
      { x: 2, y: 3 },
    ]);
  });
});

describe('generateShipPositions', () => {
  // Вспомогательная функция для получения всех клеток, занятых кораблем
  const getShipCells = (ship: ShipPosition): Array<[number, number]> => {
    const cells: Array<[number, number]> = [];
    for (const x of ship.x) {
      for (const y of ship.y) {
        cells.push([x, y]);
      }
    }
    return cells;
  };

  // Функция для проверки, что два корабля не пересекаются и соблюдают минимальное расстояние
  const areShipsValidlyPlaced = (ship1: ShipPosition, ship2: ShipPosition): boolean => {
    const cells1 = getShipCells(ship1);
    const cells2 = getShipCells(ship2);

    for (const [x1, y1] of cells1) {
      for (const [x2, y2] of cells2) {
        // Проверяем, что корабли не пересекаются и не касаются друг друга
        const distance = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
        if (distance < 2) {
          return false;
        }
      }
    }
    return true;
  };

  // Функция для проверки, что корабль размещен в пределах поля 10x10
  const isShipInBounds = (ship: ShipPosition): boolean => {
    const cells = getShipCells(ship);
    return cells.every(([x, y]) => x >= 0 && x < 10 && y >= 0 && y < 10);
  };

  // Функция для получения размера корабля
  const getShipSize = (ship: ShipPosition): number => {
    return getShipCells(ship).length;
  };

  // Функция для проверки, что корабль расположен по прямой линии
  const isShipStraight = (ship: ShipPosition): boolean => {
    const cells = getShipCells(ship);
    if (cells.length === 1) return true;

    // Сортируем клетки для проверки прямолинейности
    cells.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    // Проверяем, что корабль расположен либо по горизонтали, либо по вертикали
    const isHorizontal = cells.every(([, y]) => y === cells[0][1]);
    const isVertical = cells.every(([x]) => x === cells[0][0]);

    if (!isHorizontal && !isVertical) return false;

    // Проверяем, что клетки идут подряд
    for (let i = 1; i < cells.length; i++) {
      const [prevX, prevY] = cells[i - 1];
      const [currX, currY] = cells[i];

      if (isHorizontal && currX !== prevX + 1) return false;
      if (isVertical && currY !== prevY + 1) return false;
    }

    return true;
  };

  it('должна возвращать массив кораблей', () => {
    const ships = generateShipPositions();
    expect(Array.isArray(ships)).toBe(true);
    expect(ships.length).toBeGreaterThan(0);
  });

  it('должна возвращать правильное количество кораблей каждого размера', () => {
    for (let i = 0; i < 10; i++) {
      const ships = generateShipPositions();
      const shipSizes = ships.map(getShipSize);
      const sizeCounts = shipSizes.reduce<Record<number, number>>((acc, size) => {
        acc[size] = (acc[size] || 0) + 1;
        return acc;
      }, {});

      // Правила морского боя: 1 четырехпалубный, 2 трехпалубных, 3 двухпалубных, 4 однопалубных
      expect(sizeCounts[4]).toBe(1); // 1 четырехпалубный
      expect(sizeCounts[3]).toBe(2); // 2 трехпалубных
      expect(sizeCounts[2]).toBe(3); // 3 двухпалубных
      expect(sizeCounts[1]).toBe(4); // 4 однопалубных
    }
  });

  it('все корабли должны находиться в пределах поля 10x10', () => {
    const ships = generateShipPositions();
    ships.forEach((ship) => {
      expect(isShipInBounds(ship)).toBe(true);
    });
  });

  it('все корабли должны быть расположены по прямой линии', () => {
    const ships = generateShipPositions();
    ships.forEach((ship) => {
      expect(isShipStraight(ship)).toBe(true);
    });
  });

  it('корабли не должны пересекаться и должны соблюдать минимальное расстояние', () => {
    const ships = generateShipPositions();

    for (let i = 0; i < ships.length; i++) {
      for (let j = i + 1; j < ships.length; j++) {
        expect(areShipsValidlyPlaced(ships[i], ships[j])).toBe(true);
      }
    }
  });

  it('должна генерировать разные расстановки при повторных вызовах', () => {
    const ships1 = generateShipPositions();
    const ships2 = generateShipPositions();

    // Преобразуем позиции в строки для сравнения
    const positions1 = ships1.map((ship) => JSON.stringify(getShipCells(ship).sort()));
    const positions2 = ships2.map((ship) => JSON.stringify(getShipCells(ship).sort()));

    // Проверяем, что хотя бы одна позиция отличается
    const isDifferent = positions1.some((pos, index) => pos !== positions2[index]);
    expect(isDifferent).toBe(true);
  });

  it('каждый корабль должен иметь корректную структуру ShipPosition', () => {
    const ships = generateShipPositions();

    ships.forEach((ship) => {
      expect(ship).toHaveProperty('x');
      expect(ship).toHaveProperty('y');
      expect(Array.isArray(ship.x)).toBe(true);
      expect(Array.isArray(ship.y)).toBe(true);
      expect(ship.x.length).toBeGreaterThan(0);
      expect(ship.y.length).toBeGreaterThan(0);
      expect(ship.x.length).toBeLessThanOrEqual(4);
      expect(ship.y.length).toBeLessThanOrEqual(4);

      // Проверяем, что все координаты - числа
      ship.x.forEach((coord) => expect(typeof coord).toBe('number'));
      ship.y.forEach((coord) => expect(typeof coord).toBe('number'));
    });
  });

  it('должна генерировать стабильные результаты (функция должна работать без ошибок)', () => {
    // Проверяем, что функция работает без выбрасывания исключений
    for (let i = 0; i < 5; i++) {
      expect(() => generateShipPositions()).not.toThrow();
    }
  });
});
