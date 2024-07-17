import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts({}), eslint()],
  build: {
    lib: {
      entry: resolve(__dirname, "src"),
      name: "datepickerjs",
      fileName: "datepickerjs",
      formats: ["es", "cjs"],
    },
  },
});
