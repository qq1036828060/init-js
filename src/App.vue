<template>
  <el-config-provider :locale="locale">
    <RouterView />
  </el-config-provider>
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
import { useTheme } from "@/utils/hooks/useTheme";

import zhCn from "element-plus/es/locale/lang/zh-cn";

const locale = zhCn;
// init theme
const { initTheme } = useTheme();
initTheme();

</script>

<style>
::deep.el-popup-parent--hidden {
  width: 100% !important;
}
</style>
