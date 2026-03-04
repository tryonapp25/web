import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",   // 👈 REQUIRED
  resolve: {
    alias: {
      // use the lightweight player build to avoid eval usage in bundle
      'lottie-web': 'lottie-web/build/player/lottie_light.js'
    }
  },
  build: {
    // increase warning threshold a bit and split large node_modules into vendor chunks
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')
            ) return 'react-vendor';
            if (id.includes('three') || id.includes('@react-three')) return 'three-vendor';
            return 'vendor';
          }
        }
      }
    }
  }
});
