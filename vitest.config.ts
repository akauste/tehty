import path from "path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@vercel/postgres-kysely": path.resolve(
        __dirname,
        "./__mocks__/kysely.ts"
      ),
      "@/auth": path.resolve(__dirname, "./__mocks__/auth.ts"),
      "@/lib/db": path.resolve(__dirname, "./__mocks__/db.ts"),
      "next/server": path.resolve(__dirname, "./node_modules/next/server.js"),
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "jsdom",
    deps: {
      optimizer: {
        web: {
          // exclude: ["next/server"],
          // or disable alltogether
          enabled: false,
        },
      },
    },
  },
});
