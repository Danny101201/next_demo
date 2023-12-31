import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import * as path from 'path'
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
  plugins: [tsconfigPaths(), react()]
});