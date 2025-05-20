import {useEffect, useState} from 'react';
import {z} from 'zod';

const ThemeDefinition = z.enum(['dark', 'light']).catch('dark');

const STORAGE_KEY = 'RockPaperScissors/Theme';

export type Theme = z.infer<typeof ThemeDefinition>;

export interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export function useTheme() {
  const [theme, setTheme_] = useState<Theme>('dark');

  const setTheme = (theme: Theme) => {
    setTheme_(theme);

    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem(STORAGE_KEY, theme);
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem(STORAGE_KEY, theme);
    }
  };

  useEffect(() => {
    setTheme(ThemeDefinition.parse(localStorage.getItem(STORAGE_KEY)));
  }, []);

  useEffect(() => {
    const handleChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setTheme(ThemeDefinition.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleChange);

    return () => {
      window.removeEventListener('storage', handleChange);
    };
  }, [theme]);

  return {
    theme,
    setTheme,
  };
}
