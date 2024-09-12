import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';

const useModal = ({
  setSelectedPlayer,
}: {
  setSelectedPlayer: Dispatch<SetStateAction<'friend' | 'computer'>>;
}) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const gameWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }, []);

  const onModalClose = (
    inputRef: MutableRefObject<HTMLInputElement | null>
  ) => {
    if (modalRef.current) {
      modalRef.current.close();
    }
    if (gameWrapperRef.current) {
      gameWrapperRef.current.style.display = 'flex';
    }
    if (inputRef.current) {
      setSelectedPlayer(!inputRef.current.checked ? 'friend' : 'computer');
    }
  };

  return { modalRef, gameWrapperRef, onModalClose };
};

export default useModal;
