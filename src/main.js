import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import "@/assets/styles/reset.scss";
import "@/assets/styles/common.scss";
// 自定义指令
import directives from "@/directives/index";
// iconfont css
import "@/assets/iconfont/iconfont.scss";
// element css
import "element-plus/dist/index.css";
// element dark css
import "element-plus/theme-chalk/dark/css-vars.css";
// custom element dark css
import "@/assets/styles/element-dark.scss";
// custom element css
import "@/assets/styles/element.scss";

import ElementPlus from "element-plus";
import * as Icons from "@element-plus/icons-vue";

const app = createApp(App)

Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key]);
});

app.use(ElementPlus)
app.use(directives)
app.use(router)
app.use(store)
app.mount('#app')
