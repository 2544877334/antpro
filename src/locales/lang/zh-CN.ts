import globals from './global/zh-CN';
import routes from './routes/zh-CN';
import pages from './pages/zh-CN';
import antd from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs/locale/zh-cn';

import settingDrawerLocales from '@/components/setting-drawer/locales/zh-CN';

import dashboardAnalysis from '@/views/dashboard/analysis/locales/zh-CN';
import dashboardMonitor from '@/views/dashboard/monitor/locales/zh-CN';

import basicFormLocales from '@/views/form/basic-form/locales/zh-CN';
import stepFormLocales from '@/views/form/step-form/locales/zh-CN';
import advanceFormLocales from '@/views/form/advance-form/locales/zh-CN';

const locales = {
  localeName: 'zhCN',
  dayjsLocaleName: 'zh-cn',
  antd,
  dayjs,

  ...globals,
  ...routes,
  ...pages,
  ...settingDrawerLocales,

  ...dashboardAnalysis,
  ...dashboardMonitor,

  ...basicFormLocales,
  ...stepFormLocales,
  ...advanceFormLocales,
};

export default {
  ...locales,
};
