<template>
  <a-dropdown
    class="ant-pro-dropdown ant-pro-dropdown-action"
    placement="bottomRight"
    :trigger="['click']"
    overlayClassName="pro-components-header-dropdown-index-container"
  >
    <span :class="[noticeButton, { opened: visible }]">
      <a-badge :count="count" :style="{ boxShadow: 'none' }" class="badge">
        <slots name="bell">
          <bell-outlined class="icon" />
        </slots>
      </a-badge>
    </span>
    <template #overlay>
      <a-spin :spinning="loading" :delay="300">
        <a-tabs class="tabs">
          <a-tab-pane tab="test" key="test"></a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
  </a-dropdown>
</template>
<script lang="ts">
import { ref, defineComponent } from 'vue';
import { BellOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  name: 'NoticeDropdown',
  props: {
    // dataSource: {
    //   type: Array as PropType<>
    // },
    count: Number,
    loading: Boolean,
    popupVisible: Boolean,
    clearText: String,
    viewMoreText: String,
    clearClose: Boolean,
    emptyImage: String,
  },
  emits: ['clear', 'itemClick', 'viewMore', 'tabChange', 'update:popupVisible'],
  slots: ['bell'],
  components: {
    BellOutlined,
  },
  setup() {
    let msg = ref('');
    return {
      msg,
    };
  },
});
</script>
<style lang="less" scoped>
.popover {
  position: relative;
  width: 336px;
}

.noticeButton {
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s;
}
.icon {
  padding: 4px;
  vertical-align: middle;
}

.badge {
  font-size: 16px;
}

.tabs {
  :global {
    .ant-tabs-nav-list {
      margin: auto;
    }

    .ant-tabs-nav-scroll {
      text-align: center;
    }
    .ant-tabs-bar {
      margin-bottom: 0;
    }
  }
}
</style>
