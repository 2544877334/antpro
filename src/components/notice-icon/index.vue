<template>
  <notice-dropdown
    class="action"
    :count="currentUser && currentUser.extra && currentUser.extra.unreadCount"
    :loading="loading"
  >
    <a-tabs v-model:activeKey="activeKey">
      <template v-for="{ tabKey, title, emptyText, showViewMore } in noticesConfig" :key="tabKey">
        <a-tab-pane v-if="tabKey" :key="tabKey" :tab="title">
          <notice-list
            :title="title"
            :count="unreadMsgs[tabKey]"
            :list="noticeData[tabKey]"
            :emptyText="emptyText"
            :showViewMore="showViewMore"
            @itemClick="changeReadState"
            clearText="Empty"
            viewMoreText="See more"
            @clear="handleNoticeClear"
            @viewMore="handleViewMore"
            showClear
          >
            <template #extra="notice">
              <a-tag
                v-if="notice.extra && notice.status"
                style="margin-right: 0"
                :color="color[notice.status]"
              >
                {{ notice.extra }}
              </a-tag>
              <template v-else>
                {{ notice.extra }}
              </template>
            </template>
          </notice-list>
        </a-tab-pane>
      </template>
    </a-tabs>
    <!-- <notice-list
      tabKey="notification"
      :count="unreadMsgs.notification"
      :list="noticeData.notification"
      title="Notification"
      emptyText="You have viewed all notifications"
      showViewMore
    />
    <notice-list
      tabKey="message"
      :count="unreadMsgs.message"
      :list="noticeData.message"
      title="Message"
      emptyText="You have read all messages"
      showViewMore
    />
    <notice-list
      tabKey="event"
      title="To do"
      emptyText="You have completed all to-dos"
      :count="unreadMsgs.event"
      :list="noticeData.event"
      showViewMore
    /> -->
  </notice-dropdown>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, onBeforeUnmount } from 'vue';
import { NoticeItem, queryNotices } from '@/api/user/notice';
import moment from 'moment';
import { groupBy } from 'lodash';
import NoticeDropdown from './notice-dropdown.vue';
import NoticeList from './notice-list.vue';
import { message } from 'ant-design-vue';
import { useStore } from 'vuex';

// 如需要实时更新提醒通知，可以配置 realtime 打开该轮询，或者自行尝试配置 websocket 功能
const useFetchNotice = (getNoticeData: () => Promise<void>, realtime?: boolean) => {
  let interval: number;
  onMounted(() => {
    getNoticeData();
    if (realtime) {
      interval = setInterval(() => {
        getNoticeData();
      }, 5000);
    }
  });

  onBeforeUnmount(() => {
    clearInterval(interval);
  });
};

export default defineComponent({
  name: 'NoticeIcon',
  props: {},
  components: {
    NoticeDropdown,
    NoticeList,
  },
  emits: [],
  setup() {
    const store = useStore();
    const currentUser = computed(() => store.getters['user/currentUser']);
    const list = ref<NoticeItem[]>([]);
    const loading = ref(true);
    const activeKey = ref('notification');
    const color = {
      todo: '',
      processing: 'blue',
      urgent: 'red',
      doing: 'gold',
    };
    const noticesConfig = ref([
      {
        tabKey: 'notification',
        title: 'Notification',
        emptyText: 'You have viewed all notifications',
        showViewMore: true,
      },
      {
        tabKey: 'message',
        title: 'Message',
        emptyText: 'You have read all messages',
        showViewMore: true,
      },
      {
        tabKey: 'event',
        title: 'To do',
        emptyText: 'You have completed all to-dos',
        showViewMore: false,
      },
    ]);
    const getNoticeData = async () => {
      const notices = await queryNotices();
      if (!notices || notices.length === 0 || !Array.isArray(notices)) {
        list.value = [];
      } else {
        const newNotices = notices.map(notice => {
          const newNotice = { ...notice };

          if (newNotice.datetime) {
            newNotice.datetime = moment(notice.datetime as string).fromNow();
          }

          if (newNotice.id) {
            newNotice.key = newNotice.id;
          }
          return newNotice;
        });
        list.value = newNotices;
      }
      loading.value = false;
    };

    const noticeData = computed(() => groupBy(list.value, 'type'));

    const unreadMsgs = computed(() => {
      const unreadMsg: Record<string, number> = {};
      Object.keys(noticeData.value).forEach(key => {
        const value = noticeData.value[key];

        if (!unreadMsg[key]) {
          unreadMsg[key] = 0;
        }

        if (Array.isArray(value)) {
          unreadMsg[key] = value.filter(item => !item.read).length;
        }
      });
      return unreadMsg;
    });

    useFetchNotice(getNoticeData);

    const changeReadState = (clickedItem: NoticeItem) => {
      const { id } = clickedItem;
      const index = list.value.findIndex(item => item.id === id);
      list.value[index].read = true;
      list.value = [...list.value];
      // 你应该通过接口告诉后端更改数据库数据
    };
    const handleViewMore = (tabKey: string) => {
      message.info(`Click on view more ${tabKey}`);
    };
    const handleNoticeClear = (title: string, type: string) => {
      message.success(`Emptied ${title}`);
      list.value = list.value.filter(item => item.type !== type);
      // 你应该通过接口告诉后端更改数据库数据
    };
    return {
      noticesConfig,
      list,
      activeKey,
      loading,
      color,
      noticeData,
      unreadMsgs,
      changeReadState,
      handleNoticeClear,
      handleViewMore,
      currentUser,
    };
  },
});
</script>

<style lang="less"></style>
