import { useState, useCallback } from 'react';

export function useToggle(initialValue = false): [boolean, () => void, React.Dispatch<React.SetStateAction<boolean>>] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
}
