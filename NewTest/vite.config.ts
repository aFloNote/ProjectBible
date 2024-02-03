import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import viteCompression from 'vite-plugin-compression'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      verbose: true, // Enables logging
      algorithm: 'gzip', // Change to 'brotliCompress' for Brotli
      ext: '.gz', // Change to '.br' for Brotli
    })
  ],
  server: {
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
})
