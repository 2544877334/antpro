<template>
  <router-view v-slot="{ Component }">
    <multi-tab-store-consumer>
      <component v-if="Component" :is="Component"></component>
      <slot v-else />
    </multi-tab-store-consumer>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MultiTabStoreConsumer } from '@/components/multi-tab';

export default defineComponent({
  name: 'CustomRouterView',
  components: {
    MultiTabStoreConsumer,
  },
});
</script>
