<template>
  <div class="message">
    <el-popover
      placement="bottom"
      :width="310"
      trigger="manual"
      :visible="popoverVisible"
    >
      <template #reference>
        <el-badge
          :value="activeNum"
          class="item"
          @click="popoverVisible = !popoverVisible"
        >
          <i :class="'iconfont icon-xiaoxi'" class="toolBar-icon"></i>
        </el-badge>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="`通知(0)`" name="first">
          <div class="message-empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无通知</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="消息(0)" name="second">
          <div class="message-empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无消息</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="代办(0)" name="third">
          <div class="message-empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无代办</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-popover>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const popoverVisible = ref(false);
const activeName = ref("first");
const activeNum = ref(0);
const showRebate = ref(false);
const showPriceKey = ref(false);

// 根据activeNum 判断是否显示Popover
watch(activeNum, (val) => {
  if (val) {
    popoverVisible.value = true;
  } else {
    popoverVisible.value = false;
  }
});


const refresh = () => {
  activeNum.value = 0;
  showRebate.value = false;
  showPriceKey.value = false;
};

</script>

<style scoped lang="scss">
.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  line-height: 45px;
}
.message-list {
  display: flex;
  flex-direction: column;
  .message-item {
    display: flex;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid var(--el-border-color-light);
    &:last-child {
      border: none;
    }
    .message-icon {
      width: 40px;
      height: 40px;
      margin: 0 20px 0 5px;
    }
    .message-content {
      display: flex;
      flex-direction: column;
      .message-title {
        margin-bottom: 5px;
      }
      .message-date {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style>
