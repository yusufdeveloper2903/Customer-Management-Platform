
//IMPORT FILES
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";



//CONFIGS
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
          "style-loader",
          "css-loader",
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
    "/api": {
      target: "http://zk.uz:4023/api/v1",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  },
});
