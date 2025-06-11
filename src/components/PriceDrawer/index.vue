<template>
  <el-drawer
    v-model="drawerVisible"
    :wrapper-closable="false"
    :modal-append-to-body="false"
    :destroy-on-close="true"
    size="750px"
    :title="`${drawerProps.title}卡密价格`"
  >
    <el-table
      style="width: 800px"
      :data="drawerForm.list"
      border
      :header-cell-style="{
        background: '#FAFAFA',
        color: '#333333',
        fontWeight: 'bold',
        fontSize: '14px',
      }"
    >
      <el-table-column
        prop="title"
        label="卡密标题"
        align="center"
      ></el-table-column>
      
      <el-table-column
        prop="priceOrigin"
        label="卡密原价"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="currentPrice"
        label="卡密现价"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="myPrice"
        label="我的价格"
        align="center"
      ></el-table-column>

      <!-- 是否确认 -->
      <el-table-column
        prop="status"
        align="center"
        label="是否确认"
      >
        <template #default="{ row }">
          <el-tag v-if="row.status" type="success">已确认</el-tag>
          <el-tag v-else type="danger">未确认</el-tag>
        </template>
      </el-table-column>

      <!-- 更新时间 -->
      <el-table-column
        prop="updateTime"
        align="center"
        label="更新时间"
      >
      </el-table-column>  

      <el-table-column prop="list" label="购买价" align="center">
        <template #default="{ row }">
          <el-input
            type="number"
            v-model="row.price"
            size="default"
            style="width: 150px"
            placeholder="请输入购买价"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <el-button @click="drawerVisible = false"> 取消 </el-button>
      <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="PriceDrawer">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
// import { Key } from "@/interface/key"

interface DrawerProps {
  title: string;
  row: Partial<any>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
const drawerForm = reactive({
  id: "",
  list: [],
});
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  title: "",
  row: {},
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  drawerForm.id = drawerProps.value.row.id;
  drawerForm.list = drawerProps.value.row.list;
};

// 提交数据（新增/编辑）
const handleSubmit = async () => {
  // 验证数据 价格不能超过卡密原价 ，不能低于我的价格
  // const list = drawerForm.list as Key.ResUserPriceList[];
  // for (let i = 0; i < list.length; i++) {
  //   const item = list[i];
  //   if (item.price > item.currentPrice) {
  //     ElMessage.error({ message: `${item.title}购买价格不能超过卡密现价` });
  //     return;
  //   }
  //   if (item.price < item.myPrice) {
  //     ElMessage.error({ message: `${item.title}购买价格不能低于我的价格` });
  //     return;
  //   }
  // }
  try {
    await drawerProps.value.api!(drawerForm);
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
