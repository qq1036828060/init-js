import { defineStore } from "pinia";
import { DEFAULT_PRIMARY } from "@/config";
import piniaPersistConfig from "@/config/piniaPersist";

export const useGlobalStore = defineStore({
  id: "global",
  // 修改默认值之后，需清除 localStorage 数据
  state: () => ({
    // 当前页面是否全屏
    maximize: false,
    // 主题颜色
    primary: DEFAULT_PRIMARY,
    // 深色模式
    isDark: false,
    // 折叠菜单
    isCollapse: false,
    // 面包屑导航
    breadcrumb: true,
    // 面包屑导航图标
    breadcrumbIcon: true,
    // 标签页
    tabs: true,
    // 标签页图标
    tabsIcon: true,
    // 页脚
    footer: false,
  }),
  getters: {},
  actions: {
    // Set GlobalState
    setGlobalState(...args) {
      this.$patch({ [args[0]]: args[1] });
    }
  },
  persist: piniaPersistConfig("global")
});
