import { useCallback, useRef } from 'react';

export const useSingleUseFunction = () => {
  const hasFiredRef = useRef(false);

  return useCallback((callback: Function) => {
    if (hasFiredRef.current) return;

    hasFiredRef.current = true;
    return callback();
  }, []);
};
