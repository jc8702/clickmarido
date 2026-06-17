import { useState, useEffect } from 'react';

export function usePrevious<T>(value: T): T | undefined {
  const [prev, setPrev] = useState<T | undefined>(undefined);

  useEffect(() => {
    setPrev(value);
  }, [value]);

  return prev;
}
