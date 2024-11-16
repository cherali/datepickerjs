import { defineConfig } from "vitest/config";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import eslint from "vite-plugin-eslint";
import esbuild from "rollup-plugin-esbuild";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({}),
    eslint(),
    esbuild({
      minify: true,
      legalComments: "none",
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src"),
      name: "DRMDatepickerjs",
      formats: ["es", "cjs", "iife"],
      fileName: format => {
        if (format == "iife") return `drm-datepickerjs.standalone.js`;
        else if (format == "es") return `drm-datepickerjs.js`;
        return `drm-datepickerjs.${format}`;
      },
    },
  },
  test: {
    coverage: {
      provider: "istanbul",
      include: ["src/core/**", "src/utils/**", "src/pickers/**"],
    },
  },
});
