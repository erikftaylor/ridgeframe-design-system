import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: '../../dist/component-gallery',
  },
  plugins: [react()],
  root: 'examples/component-gallery',
});
