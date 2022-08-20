import { useState } from 'react';

const useMove = () => {
  const [state, setState] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: any) => {
    e.persist();
    setState((state) => ({ ...state, x: e.clientX, y: e.clientY }));
  };
  return {
    x: state.x,
    y: state.y,
    handleMouseMove,
  };
};

export default useMove;
