import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",   // 👈 REQUIRED
  build: {
    // increase warning threshold a bit and split large node_modules into vendor chunks
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
            if (id.includes('three') || id.includes('@react-three')) return 'three-vendor';
            return 'vendor';
          }
        }
      }
    }
  }
});
