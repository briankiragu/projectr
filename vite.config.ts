import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { join } from 'path';
import { partytownVite } from '@builder.io/partytown/utils';
import path from 'path';

export default defineConfig({
  plugins: [
    solid(),
    partytownVite({
      dest: join(__dirname, 'dist', '~partytown'),
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/ui/components'),
      '@composables': path.resolve(__dirname, './src/lib/composables'),
      '@interfaces': path.resolve(__dirname, './src/lib/interfaces'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@pages': path.resolve(__dirname, './src/ui/pages'),
      '@ui': path.resolve(__dirname, './src/ui'),
    },
  },
});
