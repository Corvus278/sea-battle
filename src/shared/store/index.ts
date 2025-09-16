import { create, StateCreator } from 'zustand';
import { HitPositionCell, ShipPosition } from '@/shared/types';
import { generateShipPositions } from '@/shared/lib/generateShipPositions';
import { combine, devtools } from 'zustand/middleware';

export type GameStoreData = {
  shipsPositions: ShipPosition[];
  hitsPositions: HitPositionCell[];
  isInitialized: boolean;
};

export type GameStoreActions = {
  addHit: (hitPosition: HitPositionCell) => void;
  initializeShips: () => void;
};

const middlewares = (
  initialState: GameStoreData,
  actionsCreator: StateCreator<GameStoreData, [], [], GameStoreActions>
) => {
  return devtools(combine<GameStoreData, GameStoreActions>(initialState, actionsCreator));
};

export const useGameStore = create(
  middlewares(
    {
      shipsPositions: [],
      hitsPositions: [],
      isInitialized: false,
    },
    (set) => {
      return {
        addHit: (hitPosition: HitPositionCell) => {
          set((state) => ({
            hitsPositions: [...state.hitsPositions, hitPosition],
          }));
        },
        initializeShips: () => {
          set((state) => {
            if (state.isInitialized) return state;
            return {
              shipsPositions: generateShipPositions(),
              isInitialized: true,
            };
          });
        },
      };
    }
  )
);
