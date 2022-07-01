import { createStore } from 'vuex';
import { user } from './modules/user';
import createPersistedState from 'vuex-persistedstate';
import ls from '@/utils/local-storage';

const debug = process.env.NODE_ENV !== 'production';

const persistedPlugin = createPersistedState({
  paths: ['app'],
  storage: {
    getItem: (key: string) => ls.get(key),
    setItem: (key: string, value: any) => ls.set(key, value),
    removeItem: (key: string) => ls.remove(key),
  },
});

export default createStore({
  modules: {
    user,
  },
  strict: debug,
  plugins: debug ? [persistedPlugin] : [],
});
