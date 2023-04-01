import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import impala from "@impalajs/core/plugin";
import plugin from "@impalajs/vite-plugin-extract-server-components";

export default defineConfig({
  plugins: [react(), impala(), plugin()],
});
