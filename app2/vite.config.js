import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'app2',
      filename: 'remoteEntry.js',
      // Expose components that can be consumed by other apps
      exposes: {
        './App': './src/App.jsx',
        './SharedContext': './src/SharedContext.jsx',  // Expose context
      },
      shared: ['react', 'react-dom']
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  server: {
    port: 5174,
    strictPort: true,
  },
  preview: {
    port: 5174,
    strictPort: true,
  }
})
