import { defineConfig } from 'vite'
// import nodePolyfills from 'vite-plugin-node-polyfills'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':{
        target:'http://localhost:3000',
        secure:false,
      },
    },
  },
  plugins: [
    react(),
    // nodePolyfills()
  ],
  
})
