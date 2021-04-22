import { ConfigEnv, loadEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import { getThemeVariables } from 'ant-design-vue/dist/theme';
import { additionalData } from './build/themeConfig';
const mock = require('./build/mock/createMockServer');

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
      vue(),
      vueJsx(),
      mock({
        cwd: process.cwd(),
      }),
    ],
    resolve: {
      alias: {
        // moment: 'moment/dist/moment.js',
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
        'moment/locale/eu',
        'moment/locale/zh-cn',
        '@ant-design/icons-vue',
        '@ant-design-vue/use',
        'lodash-es',
      ],
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: { ...getThemeVariables() },
          // DO NOT REMOVE THIS LINE
          javascriptEnabled: true,
          additionalData,
        },
      },
    },
    server:
      env.VITE_HTTP_MOCK && env.VITE_MOCK
        ? {}
        : {
            proxy: {
              // 如果你需要使用正则mock数据，可以使用代理的方式，
              // mock插件内不再做支持，因为mock url尽可能唯一，方便定位数据来排查问题，正则很容易"覆盖"真正想要的匹配数据
              '^/api/currentUser/*': {
                target: '/api/currentUser',
              },
              '/api': {
                // backend url
                target: 'https://store.antdv.com',
                ws: false,
                changeOrigin: true,
              },
            },
          },
  };
};
