import { useState, ChangeEvent, useCallback, useMemo } from 'react';
import './App.css';
import Board from './components/Board';
import {
  getBoardOptions,
  generateGrid,
  BOARD_SIZE,
  generateGridCoords,
} from './utils';
import { GridType, HistoryType, PLAYER } from './types';
import GameHistory from './components/GameHistory';

function App() {
  const [squareAmount, setSquareAmount] = useState(() => {
    return localStorage.getItem('gridSize') || '';
  });
  const [grid, setGrid] = useState<GridType | undefined>(() => {
    return squareAmount
      ? generateGrid({
          size: Number(squareAmount),
          mapper: () => null,
        })
      : undefined;
  });
  const [nullPositions, setNullPositions] = useState<Set<string> | undefined>(
    () => generateGridCoords(Number(squareAmount))
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
    const formattedGridSize = Number(squareAmount);
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
    setSquareAmount(value);
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
            const historyKeys = Object.keys(currentHistory);
            if (selectedHistoryStep) {
              setSelectedHistoryStep(undefined);
              const slicedObject = historyKeys
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
            const lastKeyIndex = historyKeys.length;
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
        setGrid(historyItem[0] as GridType);
        setNullPositions(new Set(historyItem[1] as Set<string>));
        setPlayer((key + 1) % 2 !== 0 ? PLAYER.X : PLAYER.O);
      }
      return key;
    });
  };

  const getBoardHeader = () => {
    if (!winner) {
      return <p>{`Next up: ${player}`}</p>;
    }
    return <p>{winner?.length > 1 ? 'Draw!' : `Winner: ${winner}`}</p>;
  };

  const boardSizeList = useMemo(
    () => getBoardOptions(BOARD_SIZE.min, BOARD_SIZE.max),
    []
  );

  const winner = calculateWinner();

  return (
    <div className='wrapper'>
      <h3 className='title'>Tic-Tac-Toe Game</h3>
      <div className='game__container'>
        <div className='game-board'>
          <div className='select__container'>
            <p>Choose size of the board:</p>
            <select
              id='board-size'
              name='board-size'
              value={squareAmount}
              onChange={onSelectBoardSize}
            >
              <option value='' disabled>
                --Please choose an option--
              </option>
              {boardSizeList.map((el) => (
                <option value={el} key={el}>
                  {`${el}x${el}`}
                </option>
              ))}
            </select>
            {squareAmount && (
              <div className='board-header'>
                {getBoardHeader()}
                <button type='button' onClick={onResetGame}>
                  Reset
                </button>
              </div>
            )}
          </div>

          <Board grid={grid} onClick={onClickCell} disabled={Boolean(winner)} />
        </div>
        <GameHistory history={history} onNavigateHistory={onNavigateHistory} />
      </div>
    </div>
  );
}

export default App;
