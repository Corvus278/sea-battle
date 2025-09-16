import { Ship } from '@/shared/types';
import { applyHitsToShips } from '@/shared/lib/applyHitsToShips';

const hitsPositions = [
  {
    x: 7,
    y: 3,
  },
  {
    x: 6,
    y: 3,
  },
  {
    x: 7,
    y: 4,
  },
  {
    x: 7,
    y: 5,
  },
  {
    x: 7,
    y: 6,
  },
  {
    x: 8,
    y: 6,
  },
  {
    x: 8,
    y: 5,
  },
  {
    x: 8,
    y: 4,
  },
  {
    x: 8,
    y: 3,
  },
  {
    x: 7,
    y: 2,
  },
  {
    x: 6,
    y: 2,
  },
  {
    x: 7,
    y: 1,
  },
  {
    x: 6,
    y: 1,
  },
  {
    x: 6,
    y: 4,
  },
  {
    x: 6,
    y: 5,
  },
  {
    x: 4,
    y: 6,
  },
  {
    x: 3,
    y: 5,
  },
  {
    x: 1,
    y: 4,
  },
  {
    x: 2,
    y: 3,
  },
  {
    x: 2,
    y: 7,
  },
  {
    x: 4,
    y: 8,
  },
  {
    x: 8,
    y: 8,
  },
  {
    x: 3,
    y: 1,
  },
  {
    x: 2,
    y: 1,
  },
  {
    x: 1,
    y: 0,
  },
  {
    x: 1,
    y: 2,
  },
  {
    x: 0,
    y: 8,
  },
];
const shipsPositions = [
  {
    x: [7],
    y: [2, 3, 4, 5],
  },
  {
    x: [0],
    y: [6, 7, 8],
  },
  {
    x: [4, 5, 6],
    y: [8],
  },
  {
    x: [4, 5],
    y: [2],
  },
  {
    x: [3, 4],
    y: [6],
  },
  {
    x: [0],
    y: [2, 3],
  },
  {
    x: [9],
    y: [6],
  },
  {
    x: [9],
    y: [0],
  },
  {
    x: [9],
    y: [9],
  },
  {
    x: [3],
    y: [4],
  },
];

describe('applyHitsToShips', () => {
  it('должна вернуть корабли с наложенными хитами', () => {
    const expectedRes: Ship[] = [
      {
        position: {
          x: [7],
          y: [2, 3, 4, 5],
        },
        hits: [
          { x: 7, y: 2 },
          { x: 7, y: 3 },
          { x: 7, y: 4 },
          { x: 7, y: 5 },
        ],
      },
      {
        position: {
          x: [0],
          y: [6, 7, 8],
        },
        hits: [{ x: 0, y: 8 }],
      },
      {
        position: {
          x: [4, 5, 6],
          y: [8],
        },
        hits: [{ y: 8, x: 4 }],
      },
      {
        position: {
          x: [4, 5],
          y: [2],
        },
        hits: [],
      },
      {
        position: {
          x: [3, 4],
          y: [6],
        },
        hits: [{ y: 6, x: 4 }],
      },
      {
        position: {
          x: [0],
          y: [2, 3],
        },
        hits: [],
      },
      {
        position: {
          x: [9],
          y: [6],
        },
        hits: [],
      },
      {
        position: {
          x: [9],
          y: [0],
        },
        hits: [],
      },
      {
        position: {
          x: [9],
          y: [9],
        },
        hits: [],
      },
      {
        position: {
          x: [3],
          y: [4],
        },
        hits: [],
      },
    ];

    expect(applyHitsToShips(shipsPositions, hitsPositions)).toEqual(expectedRes);
  });
});
