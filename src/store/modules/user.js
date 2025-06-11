import { defineStore } from "pinia";
import piniaPersistConfig from "@/config/piniaPersist";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    token: '',
    userInfo: {},
  }),
  getters: {
    // 获取用户信息
    userInfoGet: state => state.userInfo,
  },
  actions: {
    // 设置userInfo
    // async setUserInfo(userInfo: any) {
    //   this.$patch(userInfo);
    //   // 登陆成功后，取用户信息
    //   // const { data } = await getUserInfo();
    //   console.log(data);

    //   this.userInfo = data;
    // },
    // 更新用户信息
    // async updateUserInfo() {
    //   const { data } = await getUserInfo();
    //   this.userInfo = data;
    // },

    // 设置token
    setToken(token) {
      this.token = token;
    },

    // 清空userInfo
    clearUserInfo() {
      this.$reset();
    }
  },
  persist: piniaPersistConfig("user")
});

