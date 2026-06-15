import { useState, useEffect } from 'react';

export function useSearch(initialValue: string = '', delay: number = 300) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearch, setDebouncedSearch] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, delay);

    return () => clearTimeout(handler);
  }, [searchTerm, delay]);

  return { searchTerm, setSearchTerm, debouncedSearch };
}
