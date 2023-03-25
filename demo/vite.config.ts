import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        main: "/src/entry-client.tsx",
      },
    },
  },
  define: {
    "process.env.NODE_ENV": "'development'",
  },
});
