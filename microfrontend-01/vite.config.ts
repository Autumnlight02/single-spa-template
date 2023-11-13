import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vitePluginSingleSpa from "vite-plugin-single-spa";
import externalize from "vite-plugin-externalize-dependencies";

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
    vue(),
    vitePluginSingleSpa({
      serverPort: 3001,
      type: "mife",
      spaEntryPoint: "./src/main.ts",
    }),
  ],
});
