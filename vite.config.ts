import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'https://front-mission.bigs.or.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, '/auth'),
        secure:false,
      },
    },
  },
});