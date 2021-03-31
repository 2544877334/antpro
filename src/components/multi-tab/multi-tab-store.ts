import {
  KeepAlive,
  cloneVNode,
  reactive,
  createVNode,
  toRaw,
  defineComponent,
  watch,
  provide,
  inject,
  InjectionKey,
  UnwrapRef,
} from 'vue';
import { useRouter, useRoute, RouteLocationNormalized } from 'vue-router';
import { message } from 'ant-design-vue';
import { flattenChildren } from '@/utils/vnode-util';

export type CacheKey = string;

export interface CacheItem {
  path: CacheKey;
  route: RouteLocationNormalized;
  name?: string;
  key?: number;
  lock?: boolean;
}

export interface MultiTabStore {
  cacheList: CacheItem[];
  current: CacheKey;
  include: string[];
  exclude: string[];
}

const getName = (comp: any) => {
  return comp.displayName || comp.name;
};

export type CallerFunction = {
  close: (path: CacheKey) => void;
  closeLeft: (selectedPath: CacheKey) => void;
  closeRight: (selectedPath: CacheKey) => void;
  closeOther: (selectedPath: CacheKey) => void;
  getCaches: () => void;
  clearCache: (path: CacheKey) => void;
  refresh: (path?: CacheKey | undefined) => void;
};

export type Options = {
  defaultHomePage?: string;
};

export type MultiTabType = [CallerFunction];

let g = 1;
const guid = () => {
  return ++g;
};

const MULTI_TAB_STORE_KEY: InjectionKey<MultiTabStore> = Symbol('multi-tab-store');
export const useMultiTabStateProvider = (
  initCacheList: Omit<CacheItem, 'component' | 'key'>[] = [],
): UnwrapRef<MultiTabStore> => {
  // 定义保留的多标签状态
  const state = reactive<MultiTabStore>({
    cacheList: [],
    current: '',
    exclude: [],
    include: [],
  });
  state.cacheList.push(...initCacheList.map(item => ({ ...item, key: guid() } as CacheItem)));
  provide(MULTI_TAB_STORE_KEY, state);
  return state;
};

export const injectMultiTabStore = () => {
  return inject(MULTI_TAB_STORE_KEY)!;
};

// 创建消费端
export const MultiTabStoreConsumer = defineComponent({
  name: 'MultiTabStoreConsumer',
  setup(_props, { slots = {} }) {
    const route = useRoute();
    const state = inject(MULTI_TAB_STORE_KEY)!;
    const hasCache = (path: CacheKey) => {
      return state.cacheList.find(item => item.path === path);
    };
    watch(
      () => route.fullPath,
      () => {
        state.current = route.path;
        const index = state.cacheList.findIndex(item => item.path === route.path);
        if (state.cacheList[index]) {
          state.cacheList[index].route = { ...route };
        }
      },
      { immediate: true },
    );
    return () => {
      const component = flattenChildren((slots.default && slots.default()) || [])[0];
      if (!component) {
        return null;
      }
      const comp = component.type;
      let name = getName(comp);
      const newVNode = component as any;
      if (name === undefined && newVNode) {
        // 没有设置组件名字
        name = route.name;
      }
      // 是否存在 cache
      let cacheItem = hasCache(route.path);
      if (!cacheItem) {
        cacheItem = {
          path: route.path,
          route: { ...route },
          name,
          key: guid(),
          lock: !!route.meta.lock,
        };
        state.cacheList.push(cacheItem);
      }

      newVNode.type.name = name;
      const key = `${name}-${cacheItem.key}-${route.fullPath}`;
      const exclude = [...state.exclude];
      if (route.meta.keepAlive === false) {
        exclude.push(cacheItem.name!);
      }
      return createVNode(KeepAlive, { exclude }, { default: () => cloneVNode(newVNode, { key }) });
    };
  },
});

export const useMultiTab = (/*options?: Options*/): MultiTabType => {
  const router = useRouter();
  const route = useRoute();
  const state = inject(MULTI_TAB_STORE_KEY)!;
  const clearCache = (path: CacheKey) => {
    const cacheItem =
      state.cacheList.find(item => item.path === path) || ({ name: '' } as CacheItem);
    state.exclude = [cacheItem?.name as string];
    setTimeout(() => {
      state.exclude = [];
    });
  };

  const close = (path?: CacheKey) => {
    if (!path) {
      path = state.current;
    }
    const currentPageIndex = state.cacheList.findIndex(item => item.path === path);
    if (state.cacheList.length === 1) {
      message.info('这是最后一个标签了, 无法被关闭');
      return;
    }
    clearCache(path);
    if (path !== state.current) {
      state.cacheList.splice(currentPageIndex, 1);
      return;
    }
    const targetIndex = currentPageIndex === 0 ? currentPageIndex + 1 : currentPageIndex - 1;
    router
      .replace(state.cacheList[targetIndex].route)
      .then(() => {
        state.cacheList.splice(currentPageIndex, 1);
      })
      .catch();
  };

  const getCaches = () => {
    return state.cacheList;
  };

  // alias
  const refresh = async (path?: CacheKey | undefined) => {
    if (!path) {
      path = state.current;
    }
    clearCache(path);
    const cacheItemIndex = state.cacheList.findIndex(item => item.path === path);
    const cacheItem = state.cacheList[cacheItemIndex];
    console.log(cacheItem);
    state.cacheList[cacheItemIndex] = { ...toRaw(cacheItem), key: guid() };
    return new Promise<void>(resolve => {
      router.replace(cacheItem?.route || { path }).finally(() => {
        // 模拟loading效果，加载太快，loading 不明显，主动加个延时 ，如不需要可删除延迟
        setTimeout(() => {
          resolve();
        }, 900);
      });
    });
  };

  const deleteCaches = (start: number, num: number) => {
    const list = state.cacheList;
    const end = start + num;
    const newList = [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (i < start || i >= end || item.lock) {
        newList.push(item);
      }
    }
    state.cacheList = newList;
  };

  const closeLeft = (selectedPath: CacheKey) => {
    const index = state.cacheList.findIndex(item => item.path === selectedPath);
    const currentIndex = state.cacheList.findIndex(item => item.path === route.path);
    if (currentIndex < index) {
      router
        .replace(state.cacheList[index].route)
        .then(() => {
          deleteCaches(0, index);
        })
        .catch();
    } else {
      deleteCaches(0, index);
    }
  };

  const closeRight = (selectedPath: CacheKey) => {
    const index = state.cacheList.findIndex(item => item.path === selectedPath);
    const currentIndex = state.cacheList.findIndex(item => item.path === route.path);
    if (currentIndex > index) {
      router
        .replace(state.cacheList[index].route)
        .then(() => {
          deleteCaches(index + 1, state.cacheList.length - index - 1);
        })
        .catch();
    } else {
      deleteCaches(index + 1, state.cacheList.length - index - 1);
    }
  };

  const closeOther = (selectedPath: CacheKey) => {
    const index = state.cacheList.findIndex(cached => cached.path === selectedPath);
    router
      .replace(state.cacheList[index].route)
      .then(() => {
        deleteCaches(index + 1, state.cacheList.length - index - 1);
        deleteCaches(0, index);
      })
      .catch();
  };

  return [{ close, getCaches, clearCache, closeLeft, closeRight, closeOther, refresh }];
};

export default useMultiTab;
