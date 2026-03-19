import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './app/App';
import './app/styles/global.css';
import './shared/assets/styles/tokens/colors.css';
import './shared/assets/styles/tokens/colors-dark.css';
import './shared/assets/styles/tokens/typography.css';
import './shared/assets/styles/fonts.css';
import './app/styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
