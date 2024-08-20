import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { GridType, PLAYER, HistoryType } from '../types';
import { generateGrid, generateGridCoords } from '../utils';

const useGame = () => {
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

  const calculateWinner = useCallback(() => {
    const firstRow = grid?.get(0);
    if (grid && firstRow) {
      for (const [index, row] of grid) {
        // Find winner in a row
        if (
          row[0] !== null &&
          Object.values(row).every((cell) => cell === row[0])
        ) {
          return row[0];
        }
        //Find winner in a column
        if (
          firstRow[index] !== null &&
          [...grid.values()].every((row) => row[index] === firstRow[index])
        ) {
          return firstRow[index];
        }
      }

      //Find winner in a main diagonal
      if (
        [...grid.values()].every((row, index) => row[index] === firstRow[0])
      ) {
        return firstRow[0];
      }
      //Find winner in an anti-diagonal
      if (
        [...grid.values()].every(
          (row, index) =>
            row[grid.size - (index + 1)] === firstRow[grid.size - 1]
        )
      ) {
        return firstRow[grid.size - 1];
      }
    }

    // Find if it's a draw
    if (grid && !nullPositions?.size) {
      return 'XO';
    }

    return undefined;
  }, [grid, nullPositions]);

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
    [grid, player]
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

  const getBoardHeader = () => {
    if (!winner) {
      return `Next up: ${player}`;
    }
    return winner?.length > 1 ? 'Draw!' : `Winner: ${winner}`;
  };

  const winner = calculateWinner();
  const historyKeys = history && Object.keys(history);
  const getCurrentMove = () => {
    if (historyKeys) {
      return selectedHistoryStep
        ? selectedHistoryStep
        : historyKeys?.length - 1;
    }
    return null;
  };

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
    winner,
  };
};

export default useGame;
