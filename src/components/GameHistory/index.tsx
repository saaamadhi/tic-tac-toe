import { Fragment, memo } from 'react';
import './index.css';
import { HistoryType } from '../../types';

export default memo(function GameHistory({
  history,
  onNavigateHistory,
}: {
  history: HistoryType;
  onNavigateHistory: (key: number) => void;
}) {
  const historyKeys = history && Object.keys(history);

  if (!(historyKeys && historyKeys.length > 1)) {
    return null;
  }

  return (
    <div className='game-history'>
      <p>Steps:</p>
      <ul className='game-history__container'>
        {historyKeys.map((key) => {
          const formattedKey = Number(key);
          return (
            <Fragment key={`history-step-${key}`}>
              {formattedKey ? (
                <li className='game-history__step'>
                  <button
                    type='button'
                    onClick={() => {
                      onNavigateHistory(formattedKey);
                    }}
                  >
                    {`Go to move #${key}`}
                  </button>
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ul>
    </div>
  );
});
