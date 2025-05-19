import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';
import '@fontsource/lato/900.css';
import './globals.css';

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {RockPaperScissors} from './RockPaperScissors';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RockPaperScissors />
  </StrictMode>,
);
