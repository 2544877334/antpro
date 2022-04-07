import type { ConfigEnv, UserConfig } from 'vite';
import { loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import createMockServer from './build/mockServer';
import legacy from '@vitejs/plugin-legacy';

export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  return {
    base: env.VITE_APP_PUBLIC_PATH,
    // 兼容 Cli
    define: {
      'process.env.VUE_APP_API_BASE_URL': JSON.stringify(env.VITE_APP_API_BASE_URL),
      'process.env.VUE_APP_PUBLIC_PATH': JSON.stringify(env.VITE_APP_PUBLIC_PATH),
    },
    plugins: [
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      vue(),
      vueJsx(),
    ],
    build: {
      cssCodeSplit: false,
      chunkSizeWarningLimit: 2048,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vuex', 'vue-router'],
            antdv: ['ant-design-vue', '@ant-design/icons-vue'],
            dayjs: ['dayjs'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '~@': path.join(__dirname, './src'),
        '@': path.join(__dirname, './src'),
        '~': path.join(__dirname, './src/assets'),
        vue: 'vue/dist/vue.esm-bundler.js',
      },
    },
    optimizeDeps: {
      include: [
        'ant-design-vue/es/locale/en_US',
        'ant-design-vue/es/locale/zh_CN',
        'store/plugins/expire',
        'ant-design-vue/es/form',
        'dayjs',
        'dayjs/locale/eu',
        'dayjs/locale/zh-cn',
        '@ant-design/icons-vue',
        'lodash-es',
      ],
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: 'true; @import "~/styles/variables.less";',
            'root-entry-name': 'variable',
          },
          // DO NOT REMOVE THIS LINE
          javascriptEnabled: true,
        },
      },
    },
    server: {
      host: true,
      proxy: {
        '/api': {
          // backend url
          target:
            env.VITE_HTTP_MOCK && env.VITE_MOCK ? createMockServer() : 'https://store.antdv.com',
          ws: false,
          changeOrigin: true,
        },
      },
    },
  };
};
