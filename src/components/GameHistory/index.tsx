import { Fragment, memo } from 'react';
import './index.css';

export default memo(function GameHistory({
  historyKeys,
  onNavigateHistory,
}: {
  historyKeys?: string[];
  onNavigateHistory: (key: number) => void;
}) {
  return (
    <div className='game-history'>
      <p>Game history:</p>
      <ul className='game-history__container'>
        {historyKeys && historyKeys.length > 1
          ? historyKeys.map((key) => {
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
            })
          : null}
      </ul>
    </div>
  );
});
