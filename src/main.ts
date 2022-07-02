import 'ant-design-vue/dist/antd.variable.less';
import '@surely-vue/table/dist/index.less';
import {
  Layout,
  Menu,
  Row,
  Col,
  Card,
  Form,
  Dropdown,
  Select,
  Button,
  Checkbox,
  Tabs,
  Tag,
  Input,
  DatePicker,
  TimePicker,
  Radio,
  Tooltip,
  Space,
  Steps,
  Divider,
  Descriptions,
  Alert,
  Result,
  Statistic,
  Popconfirm,
  Popover,
  Table,
  Avatar,
  List,
  Progress,
  Switch,
  Modal,
  Rate,
  ConfigProvider,
  Empty,
  Spin,
  Drawer,
  PageHeader,
  Carousel,
  BackTop,
  Upload,
  Badge,
} from 'ant-design-vue';
import STable from '@surely-vue/table';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import router from './router';
import locale from './locales';
import App from './App.vue';

import { ProProvider, PageContainer, TransformVnode } from '@/components';
import { useIcons } from '@/icons';
import Authority from './utils/authority/authority.vue';
import './app.less';
import './router/router-guards';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app
  .use(router)
  .use(locale as any)
  .use(STable)
  .use(Layout)
  .use(Menu)
  .use(Row)
  .use(Col)
  .use(Card)
  .use(Form)
  .use(Dropdown)
  .use(Select)
  .use(Button)
  .use(Checkbox)
  .use(Tabs)
  .use(Tag)
  .use(Input)
  .use(DatePicker)
  .use(TimePicker)
  .use(Radio)
  .use(Tooltip)
  .use(Space)
  .use(Steps)
  .use(Divider)
  .use(Descriptions)
  .use(Alert)
  .use(Result)
  .use(Statistic)
  .use(Popconfirm)
  .use(Popover)
  .use(Table)
  .use(Avatar)
  .use(List)
  .use(Progress)
  .use(Switch)
  .use(Modal)
  .use(Rate)
  .use(ConfigProvider)
  .use(Empty)
  .use(Spin)
  .use(Drawer)
  .use(PageHeader)
  .use(ProProvider)
  .use(Badge)
  .use(Carousel)
  .use(BackTop)
  .use(Upload)
  .component(PageContainer.name, PageContainer)
  .component(TransformVnode.name, TransformVnode)
  .component(Authority.name, Authority);

useIcons(app);

app.mount('#app');
