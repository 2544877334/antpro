<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { computed, provide, watch } from 'vue';

import { STORAGE_LANG_KEY, useAppStore } from '@/store/app';
import { localStorage } from '@/utils/local-storage';
import useMediaQuery from '@/utils/hooks/useMediaQuery';
import { useI18n } from 'vue-i18n';
import useMenuState, { MenuStateSymbol } from './layouts/use-menu-state';
import { useMultiTabStateProvider } from './components/multi-tab';
import { defaultLang } from './locales';
import type { ConfigProviderProps } from 'ant-design-vue/lib/config-provider';

const i18n = useI18n();
const appStore = useAppStore();
const multiTabState = useMultiTabStateProvider();
const colSize = useMediaQuery();
const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs');
const menuState = useMenuState(
  {
    collapsed: isMobile.value,
    openKeys: [] as string[],
    selectedKeys: [] as string[],
    isMobile,
  },
  multiTabState,
);
const lang = localStorage.get(STORAGE_LANG_KEY, defaultLang);
if (lang) {
  appStore.SET_LANG(lang);
}
const theme = computed(() => appStore.navTheme);
watch(
  theme,
  () => {
    if (theme.value === 'realDark') {
      document
        .getElementsByTagName('html')[0]
        .setAttribute('data-pro-theme', 'antdv-pro-theme-dark');
    } else {
      document
        .getElementsByTagName('html')[0]
        .setAttribute('data-pro-theme', 'antdv-pro-theme-light');
    }
  },
  { immediate: true },
);
provide('isMobile', isMobile);
provide(
  'isRealDark',
  computed(() => theme.value === 'realDark'),
);
provide(MenuStateSymbol, menuState);
const locale = computed(() => {
  return i18n.getLocaleMessage(i18n.locale.value).antd as ConfigProviderProps['locale'];
});
</script>
