import 'ant-design-vue/dist/antd.less';
import '@surely-vue/table/dist/index.css';
import SurelyTable from '@surely-vue/table';
import { createApp, Plugin } from 'vue';
import router from './router';
import store from './store';
import locale from './locales';
import App from './App.vue';

import { ProProvider, PageContainer, TransformVnode } from '@/components';
import { useIcons } from '@/icons';
import Authority from './utils/authority/authority.vue';
import './app.less';
import './router/router-guards';

const app = createApp(App);

app
  .use(router)
  .use(locale as any)
  .use(store)
  .use(ProProvider)
  .use(SurelyTable as Plugin)
  .component(PageContainer.name, PageContainer)
  .component(TransformVnode.name, TransformVnode)
  .component(Authority.name, Authority);

useIcons(app);

app.mount('#app');
