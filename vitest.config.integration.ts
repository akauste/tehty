import path from "path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/auth": path.resolve(__dirname, "./__mocks__/auth.ts"),
      //"next/server": path.resolve(__dirname, "./node_modules/next/server.js"),
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["**/integration/*.{test,spec}.?(c|m)[jt]s?(x)"],
    deps: {
      optimizer: {
        web: {
          // exclude: ["next/server"],
          // or disable alltogether
          enabled: false,
        },
      },
    },
    env: {
      TEST_VAR: "Jippijaijee",
    },
  },
});
