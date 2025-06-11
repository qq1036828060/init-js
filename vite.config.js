import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import { wrapperEnv } from "./build/getEnv";
import { createProxy } from "./build/proxy";
import { createVitePlugins } from "./build/plugins";

// import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  return {
    plugins: createVitePlugins(viteEnv),
    // plugins: [vue()],
    root,
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/styles/var.scss";`
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      // Load proxy configuration from .env.development
      proxy: createProxy(viteEnv.VITE_PROXY)
    },
  }
})

