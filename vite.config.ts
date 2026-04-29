import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/dianqipengyouquan/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: 'index.source.html',
      },
    },
  },
})
