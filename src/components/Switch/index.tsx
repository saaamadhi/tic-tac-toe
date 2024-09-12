import { forwardRef } from 'react';
import './index.css';

const Switch = forwardRef<HTMLInputElement | null>((_, ref) => {
  return (
    <label className='switch'>
      <input type='checkbox' ref={ref} />
      <span className='slider' />
    </label>
  );
});

export default Switch;
