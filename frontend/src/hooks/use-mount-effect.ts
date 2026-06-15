import { useEffect } from 'react';

export function useMountEffect(callback: () => void | (() => void)) {
  useEffect(() => {
    return callback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
