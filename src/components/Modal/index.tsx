import { MutableRefObject, forwardRef, useRef } from 'react';

import Switch from '../Switch';
import './index.css';

const Modal = forwardRef<
  HTMLDialogElement | null,
  {
    onModalClose: (ref: MutableRefObject<HTMLInputElement | null>) => void;
  }
>(({ onModalClose }, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <dialog ref={ref} id='game-modal' className='modal'>
      <h2 className='title'>Tic-Tac-Toe Game</h2>
      <p>Play with:</p>
      <div className='player__switcher'>
        <p>Friend</p>
        <Switch ref={inputRef} />
        <p>Computer</p>
      </div>

      <button
        className='modal__button'
        onClick={() => {
          onModalClose(inputRef);
        }}
      >
        Continue
      </button>
    </dialog>
  );
});

export default Modal;
