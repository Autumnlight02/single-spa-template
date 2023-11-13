import { defineConfig } from 'vite'
import externalize from 'vite-plugin-externalize-dependencies';

const externalDependencies = ["single-spa"]

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: "src/main.ts",
      output: {
        format: "esm",
      },
      external: externalDependencies
    },
  },
  plugins: [
    externalize({ externals: externalDependencies })
  ]
});