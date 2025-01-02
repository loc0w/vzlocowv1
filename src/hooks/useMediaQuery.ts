// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  // SSR için başlangıç değeri false
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // window nesnesinin varlığını kontrol et (SSR için)
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      
      // İlk yükleme için değeri ayarla
      setMatches(media.matches);

      // Listener fonksiyonu
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // Media query değişikliklerini dinle
      if (media.addEventListener) {
        media.addEventListener('change', listener);
      } else {
        // Eski tarayıcılar için fallback
        media.addListener(listener);
      }

      // Cleanup
      return () => {
        if (media.removeEventListener) {
          media.removeEventListener('change', listener);
        } else {
          // Eski tarayıcılar için fallback
          media.removeListener(listener);
        }
      };
    }
  }, [query]);

  return matches;
}

// Kullanım örnekleri için sabit değerler
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
} as const;