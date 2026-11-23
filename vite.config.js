import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(root, 'index.html'),
        formulas: resolve(root, 'formulas/index.html'),
        polygonVocabulary: resolve(root, 'lessons/polygon-vocabulary.html'),
      },
    },
  },
});
