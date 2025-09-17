import { create, StateCreator } from 'zustand';
import { HitPositionCell, Player, ShipPosition } from '@/shared/types';
import { generateShipPositions } from '@/shared/lib/generateShipPositions';
import { combine, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { checkIsHitOnShip } from '@/shared/lib/checkIsHitOnShip';

export type GameStoreData = {
  1: PlayerStoreData;
  2: PlayerStoreData;
  activePlayer: Player['id'];
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
      activePlayer: 1,
    },
    (set) => ({
      addHit: (hitPosition: HitPositionCell, forPlayer: Player['id']) => {
        set((state) => {
          if (forPlayer === state.activePlayer) {
            return state;
          }

          state[forPlayer].hitsPositions.push(hitPosition);

          if (
            !state[forPlayer].shipsPositions.some((shipPosition) =>
              checkIsHitOnShip(shipPosition, hitPosition)
            )
          ) {
            state.activePlayer = forPlayer;
          }

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
