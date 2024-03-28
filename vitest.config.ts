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
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
      "**/integration/**",
    ],
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
      VERCEL_ENV: "true",
      POSTGRES_URL: "Dummy",
    },
    coverage: {
      reporter: ["text"], // 'json', 'html'
    },
  },
});
