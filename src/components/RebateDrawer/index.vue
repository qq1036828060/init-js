<template>
  <el-drawer
    v-model="drawerVisible"
    :wrapper-closable="false"
    :modal-append-to-body="false"
    :destroy-on-close="true"
    size="750px"
    :title="`${drawerProps.title}佣金`"
  >
    <el-table
      :span-method="objectSpanMethod"
      style="width: 800px"
      :data="drawerForm.rebates"
      border
      :header-cell-style="{
        background: '#FAFAFA',
        color: '#333333',
        fontWeight: 'bold',
        fontSize: '14px',
      }"
    >
      <el-table-column
        prop="pointName"
        label="仓库名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="expressName"
        label="快递名称"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="myRebate"
        label="我的佣金"
        align="center"
        v-if="!drawerProps.isAdmin"
      ></el-table-column>

      <!-- 是否确认 -->
      <el-table-column prop="status" align="center" label="是否确认">
        <template #default="{ row }">
          <el-tag v-if="row.status" type="success">已确认</el-tag>
          <el-tag v-else type="danger">未确认</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="rebate" label="佣金金额" align="center">
        <template #default="{ row }">
          <el-input-number class="width-110" v-model="row.rebate" :step="0.1" />
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <div class="footer">
        <div>
          统一调整金额：
          <el-input-number v-model="flatAmount" :step="0.1" />
          <el-button class="mr-10" type="primary" @click="handleApply"
            >应用</el-button
          >
        </div>
        <div>
          <el-button @click="drawerVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="RebateDrawer">
import { ref } from "vue";
import { ElMessage } from "element-plus";

const flatAmount = ref("");

interface DrawerProps {
  title: string;
  isAdmin?: boolean;
  row: Partial<any>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
const drawerForm = ref({
  id: "",
  rebates: [],
});
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  title: "",
  isAdmin: false,
  row: {},
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  drawerForm.value.id = drawerProps.value.row.id;
  drawerForm.value.rebates = drawerProps.value.row.list;
  initParams();
};

const initParams = () => {
  // 根据pointId 进行排序
  drawerForm.value.rebates.sort((a: any, b: any) => {
    return a.pointId - b.pointId;
  });
  // // 如果没有折扣金额，就默认为0
  // drawerForm.value.rebates.forEach((item: any) => {
  //   item.rebate = item.rebate ? item.rebate : 0.00;
  // });
};

// 根据pointName 进行合并单元格
const objectSpanMethod = ({ row, rowIndex, columnIndex }: any) => {
  let num = 1;
  // 根据columnIndex判断需要判断值是否相等的字段
  // standardFirstName,standardSecondName,dataItem及tableData需要改为自己的项目字段-----------重要...重要...重要...--------
  if (columnIndex === 0) {
    num = recursionRowSpan(
      row,
      rowIndex,
      "pointName",
      drawerForm.value.rebates
    );
  }
  return {
    rowspan: num,
    colspan: 1,
  };
};
// 通过递归获取单元格所占大小
let nowRowSpan = 1;
const recursionRowSpan = (
  row: any,
  rowIndex: any,
  str: any,
  data: any
): any => {
  let num: number = 0;
  // row[str] == data[rowIndex - 1][str]这个用来判断是否合并，可以改为自己的判断方法
  // 判断上一行字段的值与改行值是否一致
  if (nowRowSpan == 1 && rowIndex > 0 && row[str] == data[rowIndex - 1][str]) {
    return 0;
  }
  // 判断下一行字段的值与改行值是否一致
  if (rowIndex + 1 < data.length && row[str] == data[rowIndex + 1][str]) {
    nowRowSpan++;
    num = rowIndex + 1;
    return recursionRowSpan(data[num], num, str, data);
  } else {
    num = nowRowSpan;
    nowRowSpan = 1;
    return num;
  }
};

// 统一调整金额
const handleApply = () => {
  if (!flatAmount.value) {
    ElMessage.warning({ message: "请输入金额！" });
    return;
  }
  drawerForm.value.rebates.forEach((item: any) => {
    item.rebate += flatAmount.value;
  });
};

// 提交数据（新增/编辑）
const handleSubmit = async () => {
  try {
    await drawerProps.value.api!(drawerForm.value);
    ElMessage.success({ message: `${drawerProps.value.title}成功！` });
    drawerProps.value.getTableList!();
    drawerVisible.value = false;
  } catch (error) {
    console.log(error);
  }
};

defineExpose({
  acceptParams,
});
</script>

<style scoped lang="scss">
.footer {
  display: flex;
  justify-content: space-between;
}
</style>
