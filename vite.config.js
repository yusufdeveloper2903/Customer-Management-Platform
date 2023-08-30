import { fileURLToPath } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@validators": fileURLToPath(
        new URL("./src/plugins/validations/validators", import.meta.url)
      ),
    },
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",

          // Translates CSS into CommonJS
          "css-loader",

          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  build: {
    outDir: "./dist",
    chunkSizeWarningLimit: 1600,
  },
  proxy: {
    // with options
    "/api": {
      target: "http://zk.uz:4023/api/v1",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  },
});
