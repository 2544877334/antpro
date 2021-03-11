<template>
  <router-view v-slot="{ Component }">
    <multi-tab-store-consumer v-if="Component">
      <component :is="Component"></component>
    </multi-tab-store-consumer>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MultiTabStoreConsumer } from '@/components/multi-tab';

export default defineComponent({
  name: 'RouteView',
  components: {
    MultiTabStoreConsumer,
  },
});
</script>
