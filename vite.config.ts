import type { ConfigEnv, UserConfig } from 'vite';
import { loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import { getThemeVariables } from 'ant-design-vue/dist/theme';
const { cssVariable } = require('./build/cssVariable');
import createMockServer from './build/mockServer';

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
    plugins: [vue(), vueJsx()],
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
        dayjs$: 'dayjs/esm/index.js',
        'dayjs/locale': 'dayjs/esm/locale',
        '~@': path.join(__dirname, './src'),
        '@': path.join(__dirname, './src'),
        vue: 'vue/dist/vue.esm-bundler.js',
      },
    },
    optimizeDeps: {
      include: [
        'ant-design-vue/es/locale/en_US',
        'ant-design-vue/es/locale/zh_CN',
        'store/plugins/expire',
        'ant-design-vue/es/_util/vue-types',
        'ant-design-vue/es/form',
        'dayjs',
        'dayjs/esm/locale/eu',
        'dayjs/esm/locale/zh-cn',
        '@ant-design/icons-vue',
        'lodash-es',
      ],
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            ...getThemeVariables(),
            ...cssVariable(),
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
