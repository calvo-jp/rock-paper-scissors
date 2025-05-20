import {createContext, useContext} from 'react';
import invariant from 'tiny-invariant';
import type {UseThemeReturn} from './useTheme';

export const ThemeContext = createContext<UseThemeReturn | null>(null);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  invariant(context);
  return context;
};
