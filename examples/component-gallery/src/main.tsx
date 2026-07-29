import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/eb-garamond';
import '../../../layouts/index.css';
import './gallery.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Gallery } from './Gallery';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Gallery />
  </StrictMode>,
);
