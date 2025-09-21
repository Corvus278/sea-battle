import { create, StateCreator } from 'zustand';
import { HitPositionCell, Player, ShipPosition } from '@/shared/types';
import { generateShipPositions } from '@/shared/lib/generateShipPositions';
import { combine, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { checkIsHitOnShip } from '@/shared/lib/checkIsHitOnShip';
import { applyHitsToShips } from '@/shared/lib/applyHitsToShips';
import { checkIsShipsDestroyed } from '@/shared/lib/checkIsShipsDestroyed';

export type GameStoreData = {
  1: PlayerStoreData;
  2: PlayerStoreData;
  activePlayer: Player['id'];
  winner: Player['id'] | null;
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
      winner: null,
    },
    (set, getState) => ({
      addHit: (hitPosition: HitPositionCell, forPlayer: Player['id']) => {
        const isHitOnShip = getState()[forPlayer].shipsPositions.some((shipPosition) =>
          checkIsHitOnShip(shipPosition, hitPosition)
        );
        const prevActivePlayerId = getState().activePlayer;

        set((state) => {
          if (forPlayer === state.activePlayer) {
            return state;
          }

          state[forPlayer].hitsPositions.push(hitPosition);

          if (!isHitOnShip) {
            state.activePlayer = forPlayer;
            return state;
          }

          return state;
        });

        if (isHitOnShip) {
          setTimeout(() => {
            set((state) => {
              const playerState = state[forPlayer];

              const shipsWithHits = applyHitsToShips(
                playerState.shipsPositions,
                playerState.hitsPositions
              );

              if (checkIsShipsDestroyed(shipsWithHits)) {
                state.winner = prevActivePlayerId;
              }

              return state;
            });
          });
        }
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

          state.winner = null;

          return state;
        });
      },
    })
  )
);
