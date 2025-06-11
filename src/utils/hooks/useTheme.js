import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import { DEFAULT_PRIMARY } from "@/config";
import { useGlobalStore } from "@/store/modules/global";

/**
 * @description 全局主题
 * */
export const useTheme = () => {
  const globalStore = useGlobalStore();
  const { primary, isDark } = storeToRefs(globalStore);

  // 切换暗黑模式 ==> 并带修改主题颜色、侧边栏颜色
  const switchDark = () => {
    const html = document.documentElement;
    if (isDark.value) html.setAttribute("class", "dark");
    else html.setAttribute("class", "");
    changePrimary(primary.value);
  };

  // 修改主题颜色
  const changePrimary = (val) => {
    if (!val) {
      val = DEFAULT_PRIMARY;
      ElMessage({ type: "success", message: `主题颜色已重置为 ${DEFAULT_PRIMARY}` });
    }
    globalStore.setGlobalState("primary", val);
  };

  // init theme
  const initTheme = () => {
    switchDark();
  };

  return {
    initTheme,
    switchDark,
    changePrimary,
  };
};
