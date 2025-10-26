import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
  resolve: {
    alias: {
      "#r": path.resolve(__dirname, "./src"),
      "#config": path.resolve(__dirname, "./src/config"),
      "#core": path.resolve(__dirname, "./src/core"),
      "#auth": path.resolve(__dirname, "./src/core/auth"),
      "#errors": path.resolve(__dirname, "./src/core/errors"),
      "#modules": path.resolve(__dirname, "./src/core/modules"),
      "#users": path.resolve(__dirname, "./src/core/users"),
      "#middleware": path.resolve(__dirname, "./src/middleware"),
      "#types": path.resolve(__dirname, "./src/types"),
      "#utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
