import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { GridType, PLAYER, HistoryType } from '../types';
import {
  calculateWinner,
  generateGrid,
  generateGridCoords,
  getCornerMoves,
  isComputerWinningMove,
} from '../utils';

const useGame = ({
  selectedPlayer,
}: {
  selectedPlayer: 'friend' | 'computer';
}) => {
  const [boardSize, setBoardSize] = useState(() => {
    return localStorage.getItem('gridSize') || '';
  });
  const [grid, setGrid] = useState<GridType | undefined>(() => {
    return boardSize
      ? generateGrid({
          size: Number(boardSize),
          mapper: () => null,
        })
      : undefined;
  });
  const [nullPositions, setNullPositions] = useState<Set<string> | undefined>(
    () => generateGridCoords(Number(boardSize))
  );

  const [player, setPlayer] = useState<PLAYER>(PLAYER.X);

  const [history, setHistory] = useState<HistoryType | undefined>(() => {
    return grid ? { 0: [new Map(grid), nullPositions] } : undefined;
  });
  const [selectedHistoryStep, setSelectedHistoryStep] = useState<
    number | undefined
  >();

  const onResetGame = () => {
    const formattedGridSize = Number(boardSize);
    const initNullPositions = generateGridCoords(formattedGridSize);
    const initGrid = generateGrid({
      size: formattedGridSize,
      mapper: () => null,
    });

    if (player !== PLAYER.X) {
      setPlayer(PLAYER.X);
    }

    setGrid(initGrid);
    setNullPositions(initNullPositions);
    setHistory({ 0: [new Map(initGrid), new Set(initNullPositions)] });
    setSelectedHistoryStep(undefined);
  };

  const onSelectBoardSize = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const formattedValue = Number(value);
    const initGrid = generateGrid({
      size: formattedValue,
      mapper: () => null,
    });
    const initNullPositions = generateGridCoords(formattedValue);
    if (player !== PLAYER.X) {
      setPlayer(PLAYER.X);
    }
    setBoardSize(value);
    setGrid(initGrid);
    setNullPositions(initNullPositions);
    setHistory({
      0: [new Map(initGrid), new Set(initNullPositions)],
    });
    setSelectedHistoryStep(undefined);
    localStorage.setItem('gridSize', value);
  };

  const onClickCell = useCallback(
    ({ rowId, cellId }: { rowId: number; cellId: number }) => {
      const row = grid?.get(rowId);
      if (row && row[cellId] === null) {
        nullPositions?.delete(`${rowId},${cellId}`);

        setPlayer((currentPlayer) =>
          currentPlayer === PLAYER.X ? PLAYER.O : PLAYER.X
        );
        const newValue = {
          [cellId]: player,
        };

        grid?.set(rowId, { ...row, ...newValue });

        setHistory((currentHistory) => {
          if (currentHistory) {
            const currentHistoryKeys = Object.keys(currentHistory);
            if (selectedHistoryStep) {
              setSelectedHistoryStep(undefined);
              const slicedObject = currentHistoryKeys
                .slice(0, selectedHistoryStep + 1)
                .reduce(
                  (
                    acc: Record<number, (GridType | Set<string> | undefined)[]>,
                    key
                  ) => {
                    const index = Number(key);
                    acc[index] = currentHistory[index];
                    return acc;
                  },
                  {}
                );
              return {
                ...slicedObject,
                ...{
                  [selectedHistoryStep + 1]: [
                    new Map(grid),
                    new Set(nullPositions),
                  ],
                },
              };
            }
            const lastKeyIndex = currentHistoryKeys.length;
            return {
              ...currentHistory,
              ...{ [lastKeyIndex]: [new Map(grid), new Set(nullPositions)] },
            };
          }
        });
      }
    },
    [grid, player, nullPositions, selectedHistoryStep]
  );

  const onNavigateHistory = (key: number) => {
    setSelectedHistoryStep((currentStep) => {
      if (history && currentStep !== key) {
        const historyItem = history[key];
        setGrid(new Map(historyItem[0] as GridType));
        setNullPositions(new Set(historyItem[1] as Set<string>));
        setPlayer((key + 1) % 2 !== 0 ? PLAYER.X : PLAYER.O);
      }
      return key;
    });
  };

  const { winner, ...rest } = calculateWinner(grid, nullPositions);

  const getBoardHeader = useCallback(() => {
    if (!winner) {
      return `Next up: ${player}`;
    }
    return winner.length > 1 ? 'Draw!' : `Winner: ${winner}`;
  }, [winner, player]);

  const historyKeys = history && Object.keys(history);
  const getCurrentMove = () => {
    if (historyKeys) {
      return selectedHistoryStep
        ? selectedHistoryStep
        : historyKeys?.length - 1;
    }
    return null;
  };

  const isCellDisabled = useMemo(() => {
    return (
      Boolean(winner) || (selectedPlayer === 'computer' && player === PLAYER.O)
    );
  }, [winner, player, selectedPlayer]);

  const onComputerMove = useCallback(
    (emptyCellIndexes: string[]) => {
      let timeoutId: number;
      const tempGrid = new Map(grid);
      const cornerMoves = grid ? getCornerMoves(grid.size) : [];

      for (const move of emptyCellIndexes) {
        const [row, column] = move!.split(',').map(Number);
        // 1. Try to make a winning move (if possible)
        if (isComputerWinningMove(PLAYER.O, row, column, tempGrid)) {
          timeoutId = setTimeout(() => {
            onClickCell({ rowId: row, cellId: column });
          }, 500);
          return timeoutId;
        }
        // 2. Block the player's winning move (if possible)
        if (isComputerWinningMove(PLAYER.X, row, column, tempGrid)) {
          timeoutId = setTimeout(() => {
            onClickCell({ rowId: row, cellId: column });
          }, 500);
          return timeoutId;
        }
      }

      // 3. Prioritize the center
      const gridSize = Math.sqrt(emptyCellIndexes.length + tempGrid.size); // Assuming a square grid
      const center = Math.floor(gridSize / 2);
      if (tempGrid.get(center)?.[center] === null) {
        timeoutId = setTimeout(() => {
          onClickCell({ rowId: center, cellId: center });
        }, 500);
        return timeoutId;
      }

      // 4. Prioritize corners for strategic advantage (if gridSize > 3)
      for (const move of cornerMoves) {
        if (emptyCellIndexes.includes(move)) {
          const [row, column] = move.split(',').map(Number);
          timeoutId = setTimeout(() => {
            onClickCell({ rowId: row, cellId: column });
          }, 500);
          return timeoutId;
        }
      }

      // 5. Default to a random move if no strategic moves available
      const randomMove = Math.floor(Math.random() * emptyCellIndexes.length);
      const nextCell = emptyCellIndexes[randomMove]?.split(',').map(Number);
      if (nextCell) {
        timeoutId = setTimeout(() => {
          onClickCell({
            rowId: nextCell[0],
            cellId: nextCell[1],
          });
        }, 500);

        return timeoutId;
      }
    },
    [grid, onClickCell]
  );

  useEffect(() => {
    let timeoutId: number | undefined;
    if (
      !winner &&
      selectedPlayer === 'computer' &&
      player === PLAYER.O &&
      nullPositions &&
      !selectedHistoryStep
    ) {
      const nullPositionsValues = [...nullPositions.values()];
      timeoutId = onComputerMove(nullPositionsValues);
    }

    return () => {
      if (typeof timeoutId === 'number') {
        clearTimeout(timeoutId);
      }
    };
  }, [
    selectedPlayer,
    player,
    winner,
    selectedHistoryStep,
    nullPositions,
    onComputerMove,
  ]);

  return {
    boardSize,
    grid,
    getCurrentMove,
    historyKeys,
    onResetGame,
    onSelectBoardSize,
    onClickCell,
    onNavigateHistory,
    getBoardHeader,
    winnerDetails: { winner, ...rest },
    isCellDisabled,
  };
};

export default useGame;
