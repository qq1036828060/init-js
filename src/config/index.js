/** 全局默认配置项 */ 

// 后端微服务模块前缀
export const PORT = "/agent";

// 首页地址（默认）
export const HOME_URL = "/home";

// 登录页地址（默认）
export const LOGIN_URL = "/login";

// 默认主题颜色
export const DEFAULT_PRIMARY = "#009688";

// 路由白名单地址（必须是本地存在的路由 staticRouter.ts 中）
export const ROUTER_WHITE_LIST = ["/500","/404","/403"];
