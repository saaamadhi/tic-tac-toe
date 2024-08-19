import Board from './components/Board';
import BoardSizeSelector from './components/BoardSizeSelector';
import GameHistory from './components/GameHistory';
import useGame from './hooks/useGame';
import './App.css';
import Canvas from './components/Canvas';

function App() {
  const {
    boardSize,
    grid,
    history,
    onResetGame,
    onSelectBoardSize,
    onClickCell,
    onNavigateHistory,
    getBoardHeader,
    winner,
  } = useGame();

  return (
    <>
      <Canvas />
      <div className='wrapper'>
        <h3 className='title'>Tic-Tac-Toe Game</h3>
        <div className='game__container'>
          <div className='game-board'>
            <div className='select__container'>
              <BoardSizeSelector
                size={boardSize}
                onSelectBoardSize={onSelectBoardSize}
              />
              {boardSize && (
                <div className='board-header'>
                  <p>{getBoardHeader()}</p>
                  <button type='button' onClick={onResetGame}>
                    Reset
                  </button>
                </div>
              )}
            </div>

            <Board
              grid={grid}
              onClick={onClickCell}
              disabled={Boolean(winner)}
            />
          </div>
          <GameHistory
            history={history}
            onNavigateHistory={onNavigateHistory}
          />
        </div>
      </div>
    </>
  );
}

export default App;
