import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleMatchChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener('change', handleMatchChange);
    setMatches(mediaQueryList.matches);
    return () => {
      mediaQueryList.removeEventListener('change', handleMatchChange);
    };
  }, [query]);

  return matches;
}

export const useMobile = () => useMediaQuery('(max-width: 768px)');
