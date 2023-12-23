// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { constants } from "zlib";
import { defineConfig, loadEnv } from "file:///Users/matveyb/Desktop/CODE/crypto/overnight_projects/dapp_NEW/node_modules/vite/dist/node/index.js";
import compression from "file:///Users/matveyb/Desktop/CODE/crypto/overnight_projects/dapp_NEW/node_modules/vite-plugin-compression/dist/index.mjs";
import vue from "file:///Users/matveyb/Desktop/CODE/crypto/overnight_projects/dapp_NEW/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import nodePolyfills from "file:///Users/matveyb/Desktop/CODE/crypto/overnight_projects/dapp_NEW/node_modules/rollup-plugin-polyfill-node/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///Users/matveyb/Desktop/CODE/crypto/overnight_projects/dapp_NEW/vite.config.ts";
var MODE = process.env.NODE_ENV;
var development = MODE === "development";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      vue(),
      compression({
        ext: ".br",
        algorithm: "brotliCompress",
        include: /\.(js|css|html|svg|json|map)(\?.*)?$/i,
        compressionOptions: {
          params: {
            [constants.BROTLI_PARAM_QUALITY]: 11
          }
        },
        minRatio: 0.8,
        deleteOriginalAssets: false
      }),
      // Gzip compression
      compression({
        ext: ".gz",
        algorithm: "gzip",
        include: /\.(js|css|html|svg|json|map)(\?.*)?$/i,
        minRatio: 0.8,
        deleteOriginalAssets: false
      }),
      development && nodePolyfills({
        include: [
          "node_modules/**/*.js",
          /node_modules\/.vite\/.*js/
        ],
        crypto: true,
        http: true
      })
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
        crypto: "crypto-browserify",
        stream: "stream-browserify",
        assert: "assert"
      }
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      "process.env": process.env
    },
    build: {
      rollupOptions: {
        plugins: [nodePolyfills({ crypto: true, http: true })]
      },
      commonjsOptions: {
        transformMixedEsModules: true
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWF0dmV5Yi9EZXNrdG9wL0NPREUvY3J5cHRvL292ZXJuaWdodF9wcm9qZWN0cy9kYXBwX05FV1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21hdHZleWIvRGVza3RvcC9DT0RFL2NyeXB0by9vdmVybmlnaHRfcHJvamVjdHMvZGFwcF9ORVcvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21hdHZleWIvRGVza3RvcC9DT0RFL2NyeXB0by9vdmVybmlnaHRfcHJvamVjdHMvZGFwcF9ORVcvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCc7XG5pbXBvcnQgeyBjb25zdGFudHMgfSBmcm9tICd6bGliJztcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuaW1wb3J0IG5vZGVQb2x5ZmlsbHMgZnJvbSAncm9sbHVwLXBsdWdpbi1wb2x5ZmlsbC1ub2RlJztcblxuY29uc3QgTU9ERSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WO1xuY29uc3QgZGV2ZWxvcG1lbnQgPSBNT0RFID09PSAnZGV2ZWxvcG1lbnQnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcblxuICByZXR1cm4ge1xuXG4gICAgcGx1Z2luczogW1xuICAgICAgdnVlKCksXG4gICAgICAoY29tcHJlc3Npb24gYXMgYW55KSh7XG4gICAgICAgIGV4dDogJy5icicsXG4gICAgICAgIGFsZ29yaXRobTogJ2Jyb3RsaUNvbXByZXNzJyxcbiAgICAgICAgaW5jbHVkZTogL1xcLihqc3xjc3N8aHRtbHxzdmd8anNvbnxtYXApKFxcPy4qKT8kL2ksXG4gICAgICAgIGNvbXByZXNzaW9uT3B0aW9uczoge1xuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgW2NvbnN0YW50cy5CUk9UTElfUEFSQU1fUVVBTElUWV06IDExLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIG1pblJhdGlvOiAwLjgsXG4gICAgICAgIGRlbGV0ZU9yaWdpbmFsQXNzZXRzOiBmYWxzZSxcbiAgICAgIH0pLFxuICAgICAgLy8gR3ppcCBjb21wcmVzc2lvblxuICAgICAgKGNvbXByZXNzaW9uIGFzIGFueSkoe1xuICAgICAgICBleHQ6ICcuZ3onLFxuICAgICAgICBhbGdvcml0aG06ICdnemlwJyxcbiAgICAgICAgaW5jbHVkZTogL1xcLihqc3xjc3N8aHRtbHxzdmd8anNvbnxtYXApKFxcPy4qKT8kL2ksXG4gICAgICAgIG1pblJhdGlvOiAwLjgsXG4gICAgICAgIGRlbGV0ZU9yaWdpbmFsQXNzZXRzOiBmYWxzZSxcbiAgICAgIH0pLFxuICAgICAgZGV2ZWxvcG1lbnRcbiAgICAgICYmIChub2RlUG9seWZpbGxzIGFzIGFueSkoe1xuICAgICAgICBpbmNsdWRlOiBbXG4gICAgICAgICAgJ25vZGVfbW9kdWxlcy8qKi8qLmpzJyxcbiAgICAgICAgICAvbm9kZV9tb2R1bGVzXFwvLnZpdGVcXC8uKmpzLyxcbiAgICAgICAgXSxcbiAgICAgICAgY3J5cHRvOiB0cnVlLFxuICAgICAgICBodHRwOiB0cnVlLFxuICAgICAgfSksXG4gICAgXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgICAgY3J5cHRvOiAnY3J5cHRvLWJyb3dzZXJpZnknLFxuICAgICAgICBzdHJlYW06ICdzdHJlYW0tYnJvd3NlcmlmeScsXG4gICAgICAgIGFzc2VydDogJ2Fzc2VydCcsXG4gICAgICB9LFxuICAgIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICBfX0FQUF9FTlZfXzogSlNPTi5zdHJpbmdpZnkoZW52LkFQUF9FTlYpLFxuICAgICAgJ3Byb2Nlc3MuZW52JzogcHJvY2Vzcy5lbnYsXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBwbHVnaW5zOiBbKG5vZGVQb2x5ZmlsbHMgYXMgYW55KSh7IGNyeXB0bzogdHJ1ZSwgaHR0cDogdHJ1ZSB9KV0sXG4gICAgICB9LFxuICAgICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRXLFNBQVMsZUFBZSxXQUFXO0FBQy9ZLFNBQVMsaUJBQWlCO0FBRTFCLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sU0FBUztBQUNoQixPQUFPLG1CQUFtQjtBQU4wTSxJQUFNLDJDQUEyQztBQVFyUixJQUFNLE9BQU8sUUFBUSxJQUFJO0FBQ3pCLElBQU0sY0FBYyxTQUFTO0FBRzdCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUUzQyxTQUFPO0FBQUEsSUFFTCxTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUEsTUFDSCxZQUFvQjtBQUFBLFFBQ25CLEtBQUs7QUFBQSxRQUNMLFdBQVc7QUFBQSxRQUNYLFNBQVM7QUFBQSxRQUNULG9CQUFvQjtBQUFBLFVBQ2xCLFFBQVE7QUFBQSxZQUNOLENBQUMsVUFBVSxvQkFBb0IsR0FBRztBQUFBLFVBQ3BDO0FBQUEsUUFDRjtBQUFBLFFBQ0EsVUFBVTtBQUFBLFFBQ1Ysc0JBQXNCO0FBQUEsTUFDeEIsQ0FBQztBQUFBO0FBQUEsTUFFQSxZQUFvQjtBQUFBLFFBQ25CLEtBQUs7QUFBQSxRQUNMLFdBQVc7QUFBQSxRQUNYLFNBQVM7QUFBQSxRQUNULFVBQVU7QUFBQSxRQUNWLHNCQUFzQjtBQUFBLE1BQ3hCLENBQUM7QUFBQSxNQUNELGVBQ0ksY0FBc0I7QUFBQSxRQUN4QixTQUFTO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxRQUNGO0FBQUEsUUFDQSxRQUFRO0FBQUEsUUFDUixNQUFNO0FBQUEsTUFDUixDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxRQUNwRCxRQUFRO0FBQUEsUUFDUixRQUFRO0FBQUEsUUFDUixRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLGFBQWEsS0FBSyxVQUFVLElBQUksT0FBTztBQUFBLE1BQ3ZDLGVBQWUsUUFBUTtBQUFBLElBQ3pCO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxlQUFlO0FBQUEsUUFDYixTQUFTLENBQUUsY0FBc0IsRUFBRSxRQUFRLE1BQU0sTUFBTSxLQUFLLENBQUMsQ0FBQztBQUFBLE1BQ2hFO0FBQUEsTUFDQSxpQkFBaUI7QUFBQSxRQUNmLHlCQUF5QjtBQUFBLE1BQzNCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
