import { defineConfig } from "vite";
// import vitePluginSingleSpa from "vite-plugin-single-spa";
import vitePluginSingleSpa from "vite-plugin-single-spa";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: "src/main.ts",
      output: {
        format: "cjs",
      },
    },
  },
  plugins: [
    vitePluginSingleSpa({
      type: "root",
      importMaps: { type: "systemjs-importmap" },
    }),
  ],
});
