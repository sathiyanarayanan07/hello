import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Production-optimized Vite config
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: "::",  // Useful if you want LAN access for dev
    port: 3000,  // Custom dev port
  },

  build: {
    target: "esnext",       // Use modern JS for smaller bundles
    sourcemap: mode === "development", // Enable source maps only in dev
    chunkSizeWarningLimit: 1000,      // Avoid annoying warnings

    rollupOptions: {
      output: {
        // Split big libraries into separate chunks for better caching
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-slot'],
          vendor: ['axios', 'date-fns', 'zod'],
        },
      },
    },
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'date-fns', 'zod'],
  },
}));
