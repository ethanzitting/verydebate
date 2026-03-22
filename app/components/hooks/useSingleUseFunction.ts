import { useCallback, useRef } from 'react';

export const useSingleUseFunction = () => {
  const hasFiredRef = useRef(false);

  return useCallback((callback: () => unknown) => {
    if (hasFiredRef.current) return;

    hasFiredRef.current = true;
    return callback();
  }, []);
};
