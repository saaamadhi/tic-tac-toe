import Board from './components/Board';
import BoardSizeSelector from './components/BoardSizeSelector';
import GameHistory from './components/GameHistory';
import useGame from './hooks/useGame';
import './App.css';
import Canvas from './components/Canvas';

function App() {
  const {
    boardSize,
    getCurrentMove,
    grid,
    historyKeys,
    onResetGame,
    onSelectBoardSize,
    onClickCell,
    onNavigateHistory,
    getBoardHeader,
    winnerDetails,
  } = useGame();

  const { winner, coords } = winnerDetails;

  return (
    <>
      <Canvas />
      <div className='wrapper'>
        <div className='game__container'>
          <div className='game-board'>
            <h3 className='title'>Tic-Tac-Toe Game</h3>
            <div className='select__container'>
              <BoardSizeSelector
                size={boardSize}
                onSelectBoardSize={onSelectBoardSize}
              />
              {boardSize && (
                <div className='board-header'>
                  <div className='board-header__container'>
                    <p className='board-header__current-move'>
                      {historyKeys && historyKeys.length > 1
                        ? `Current move: ${getCurrentMove()}`
                        : null}
                    </p>
                    <button
                      type='button'
                      onClick={onResetGame}
                      className='board-header__reset-button'
                    >
                      Reset
                    </button>
                  </div>
                  <div
                    style={{
                      minHeight: '40px',
                    }}
                  >
                    <p>{getBoardHeader()}</p>
                  </div>
                </div>
              )}
            </div>

            <Board
              grid={grid}
              winnerCoords={coords}
              onClick={onClickCell}
              disabled={Boolean(winner)}
            />
          </div>
          <GameHistory
            historyKeys={historyKeys}
            onNavigateHistory={onNavigateHistory}
          />
        </div>
      </div>
    </>
  );
}

export default App;
