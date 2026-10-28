import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss()],
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
    server: {
      host: true,
      port: 5173,
      proxy: {
        // In development the API is proxied so cookies stay same-origin.
        "/api": { target: env.VITE_DEV_API_PROXY ?? "http://localhost:8000", changeOrigin: true },
      },
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          // Long-term cacheable vendor chunks.
          manualChunks(id) {
            if (!id.includes("node_modules")) return undefined;
            if (/[\\/](react|react-dom|scheduler|react-router)[\\/]/.test(id)) return "react";
            if (/[\\/](zod|react-hook-form|@hookform)[\\/]/.test(id)) return "forms";
            return "vendor";
          },
        },
      },
    },
  };
});
