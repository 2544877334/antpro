<template>
  <div>
    <a-alert
      message="高性能表格特点：虚拟滚动，万条数据不卡顿；列宽拖拽，实时拖拽调整列宽；表格合计，灵活配置行合计；更多功能在路上......"
      type="success"
    />
    <br />
    <a-form layout="horizontal">
      <a-row :gutter="16" type="flex" justify="start">
        <a-col :xs="12" :sm="12" :md="6">
          <a-form-item label="条数">
            <a-select v-model:value="length" style="width: 100px">
              <a-select-option :value="10">10</a-select-option>
              <a-select-option :value="100">100</a-select-option>
              <a-select-option :value="1000">1000</a-select-option>
              <a-select-option :value="10000">10000</a-select-option>
              <a-select-option :value="50000">50000</a-select-option>
              <a-select-option :value="100000">100000</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xs="12" :sm="12" :md="6">
          <a-form-item label="大小">
            <a-select v-model:value="size">
              <a-select-option value="small">紧凑</a-select-option>
              <a-select-option value="default">默认</a-select-option>
              <a-select-option value="middle">中等</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xs="12" :sm="12" :md="6">
          <a-form-item label="虚拟">
            <a-switch v-model:checked="virtual" />
          </a-form-item>
        </a-col>
        <a-col :xs="12" :sm="12" :md="6">
          <a-form-item label="加载中">
            <a-switch v-model:checked="loading" />
          </a-form-item>
        </a-col>
        <a-col :xs="12" :sm="12" :md="6">
          <a-form-item label="边框">
            <a-switch v-model:checked="bordered" />
          </a-form-item>
        </a-col>
        <a-col :xs="12" :sm="12" :md="6">
          <a-form-item label="自动行高">
            <a-switch v-model:checked="autoRowHeight" />
          </a-form-item>
        </a-col>
        <a-col :xs="12" :sm="12" :md="6">
          <a-form-item label="选择">
            <a-select v-model:value="rowSelection.type">
              <a-select-option value="radio">单选</a-select-option>
              <a-select-option value="checkbox">多选</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <br />
    <s-table
      :bordered="bordered"
      ref="tableRef"
      :size="size"
      :height="400"
      v-model:columns="columns"
      :dataSource="dataSource"
      :rowHeight="rowHeight"
      :autoRowHeight="autoRowHeight"
      :wrapText="autoRowHeight"
      :virtual="virtual"
      :loading="loading"
      stripe
      sticky
      :rowSelection="rowSelection"
      v-model:pagination="pagination"
      v-model:selectedRowKeys="selectedRowKeys"
      @change="handleChange"
    >
      <template #filterIcon="{ filtered }">
        <search-outlined :style="{ color: filtered ? '#1890ff' : undefined }" />
      </template>
      <template #cell="{ column, text }">
        <template v-if="column.key === 'operation'">
          <a>Action</a>
        </template>
        <template v-else>
          {{ text }}
        </template>
      </template>
      <template #summary>
        <s-table-summary-row>
          <s-table-summary-cell :index="0">Total</s-table-summary-cell>
          <s-table-summary-cell :index="1">
            <template #default="{ total }">{{ total }}</template>
          </s-table-summary-cell>
        </s-table-summary-row>
        <s-table-summary-row>
          <s-table-summary-cell :index="0">Blance</s-table-summary-cell>
          <s-table-summary-cell :index="1">
            <template #default="{ total }">{{ total + 999 }}</template>
          </s-table-summary-cell>
          <s-table-summary-cell :index="2" :colSpan="3">
            <template #default="{ total }">{{ total }}</template>
          </s-table-summary-cell>
        </s-table-summary-row>
      </template>
    </s-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import 'ant-design-vue/es/input/style/index';
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined';
import { RowHeight } from '@surely-vue/table/dist/src/components/interface';

const columns = [
  {
    title: 'Full Name',
    width: 150,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    maxWidth: 300,
    resizable: true,
    // colSpan: ({ data }: any) => {
    //   if (data.age === 2) {
    //     return 2;
    //   } else {
    //     return 1;
    //   }
    // },
    onFilter: (value: any, record: any) => record.name.includes(value),
    slots: { filterIcon: 'filterIcon' },
    filters: [
      {
        text: 'Joe',
        value: 'Joe',
      },
      {
        text: 'Jim',
        value: 'Jim',
      },
      {
        text: 'Submenu',
        value: 'Submenu',
        children: [
          {
            text: 'Green',
            value: 'Green',
          },
          {
            text: 'Black',
            value: 'Black',
          },
        ],
      },
    ],
  },
  {
    title: 'Age',
    width: 150,
    dataIndex: 'age',
    key: 'age',
    fixed: 'left',
    resizable: true,
    sorter: (a: any, b: any) => a.age - b.age,
    //sortOrder: 'descend', //'ascend',
  },
  {
    title: 'ColumnColumnColumnColumnColumnColumn',
    children: [
      {
        title: 'Column 1',
        dataIndex: 'address',
        key: '1',
        width: 150,
        resizable: true,
      },
      {
        title: 'Column 2',
        dataIndex: 'address',
        key: '2',
        width: 150,
        resizable: true,
      },
    ],
  },
  {
    title: 'Column 3',
    dataIndex: 'address',
    key: '3',
    width: 150,
    resizable: true,
  },
  {
    title: 'Column 4',
    dataIndex: 'address',
    key: '4',
    width: 150,
    resizable: true,
  },
  {
    title: 'Column 5',
    dataIndex: 'address',
    key: '5',
    width: 150,
    resizable: true,
  },
  {
    title: 'Column 6',
    dataIndex: 'address',
    key: '6',
    width: 150,
    resizable: true,
  },
  {
    title: 'Column 7',
    dataIndex: 'address',
    key: '7',
    width: 150,
    resizable: true,
  },
  { title: 'Column 8', dataIndex: 'address', key: '8', width: 150, resizable: true },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
  },
];

interface DataItem {
  rowKey: number;
  name: string;
  age: number;
  address: string;
}

export default defineComponent({
  name: 'App',
  setup() {
    const tableRef = ref<any>();
    const autoRowHeight = ref(false);
    const virtual = ref(true);
    const loading = ref(false);
    const bordered = ref(true);
    const length = ref(10000);
    const selectedRowKeys = ref([]);
    const expandedRowKeys = ref([]);
    const inputRef = ref();

    const dataSource = computed<DataItem[]>(() => {
      const data = [];
      for (let i = 0; i < length.value; i++) {
        data.push({
          rowKey: i,
          name: i % 2 === 1 ? `Edrward ${i}` : `Jim ${i}`,
          age: i + 1,
          address: `London Park no. ${i}`,
        });
      }
      return data;
    });

    const rowSelection = reactive({
      type: 'checkbox',
      getCheckboxProps: (record: any, index: number) => {
        if (index === 3) {
          return { disabled: true };
        }
        return { disabled: false };
      },
    });
    watch(rowSelection, () => {
      console.log(rowSelection);
    });
    const rowHeight = ref<RowHeight>((_data, baseHeight) =>
      autoRowHeight.value ? undefined : baseHeight,
    );
    const pagination = ref({
      current: 1,
      pageSize: dataSource.value.length,
      showSizeChanger: true,
    });
    const changeAutoHeight = () => {
      autoRowHeight.value = !autoRowHeight.value;
    };
    const changeVirtual = () => {
      virtual.value = !virtual.value;
    };
    const changeLoading = () => {
      loading.value = !loading.value;
    };
    const changeBordered = () => {
      bordered.value = !bordered.value;
    };

    const changeRowSelectionType = () => {
      rowSelection.type = rowSelection.type === 'checkbox' ? 'radio' : 'checkbox';
    };
    const handleChange = (info: any) => {
      console.log(info);
    };
    return {
      tableRef,
      dataSource,
      columns: ref(columns),
      size: ref('default'),
      rowHeight,
      autoRowHeight,
      changeAutoHeight,
      resizeRowsHeight: () => tableRef.value.resizeRowsHeight(),
      changeVirtual,
      changeLoading,
      virtual,
      length,
      loading,
      pagination,
      bordered,
      changeBordered,
      selectedRowKeys,
      expandedRowKeys,
      rowSelection,
      changeRowSelectionType,
      inputRef,
      handleChange,
    };
  },
  components: {
    SearchOutlined,
  },
});
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-value-wrap {
  padding: 1px 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}

.super-table-row-hover.editable-row .editable-cell-value-wrap {
  padding: 0px 11px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
</style>
