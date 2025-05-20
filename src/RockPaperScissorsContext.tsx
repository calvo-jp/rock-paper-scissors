import {createContext, useContext} from 'react';
import invariant from 'tiny-invariant';
import type {UseRockPaperScissorsReturn} from './useRockPaperScissors';

export const RockPaperScissorsContext = createContext<UseRockPaperScissorsReturn | null>(null);

export const useRockPaperScissorsContext = () => {
  const context = useContext(RockPaperScissorsContext);
  invariant(context);
  return context;
};
