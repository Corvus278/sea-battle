import { create, StateCreator } from 'zustand';
import { HitPositionCell, Player, ShipPosition } from '@/shared/types';
import { generateShipPositions } from '@/shared/lib/generateShipPositions';
import { combine, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type GameStoreData = {
  1: PlayerStoreData;
  2: PlayerStoreData;
};

export type PlayerStoreData = {
  shipsPositions: ShipPosition[];
  hitsPositions: HitPositionCell[];
  isInitialized: boolean;
};

export type GameStoreActions = {
  addHit: (hitPosition: HitPositionCell, forPlayer: Player['id']) => void;
  initializeShips: () => void;
};

const middlewares = (
  initialState: GameStoreData,
  actionsCreator: StateCreator<GameStoreData, [], [], GameStoreActions>
) => {
  return devtools(immer(combine<GameStoreData, GameStoreActions>(initialState, actionsCreator)));
};

export const useGameStore = create<GameStoreData & GameStoreActions>()(
  middlewares(
    {
      1: {
        shipsPositions: [],
        hitsPositions: [],
        isInitialized: false,
      },
      2: {
        shipsPositions: [],
        hitsPositions: [],
        isInitialized: false,
      },
    },
    (set) => ({
      addHit: (hitPosition: HitPositionCell, forPlayer: Player['id']) => {
        set((state) => {
          state[forPlayer].hitsPositions.push(hitPosition);
          return state;
        });
      },
      initializeShips: () => {
        set((state) => {
          const playerIds = [1, 2] as const;
          playerIds.forEach((playerId) => {
            if (!state[playerId].isInitialized) {
              state[playerId].shipsPositions = generateShipPositions();
              state[playerId].isInitialized = true;
            }
          });

          return state;
        });
      },
    })
  )
);
