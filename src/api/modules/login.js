import { PORT } from "@/config";
import { useUserStore } from "@/store/modules/user";
import http from "@/api";
import authMenuListData from "@/assets/json/authMenuList.json";
import loginData from "@/assets/json/loginData.json";

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params) => {
  // return http.post<any>(PORT + `/login`, params, { loading: false }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT + `/login`, params, { noLoading: true }); // 控制当前请求不显示 loading
  // return http.post<Login.ResLogin>(PORT + `/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT + `/login`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT + `/login?${qs.stringify(params, { arrayFormat: "repeat" })}`); // get 请求可以携带数组等复杂参数
  return loginData;
};

// 获取菜单列表
export const getAuthMenuListApi = () => {
  // return http.get<Menu.MenuList>(PORT + `/v1/auth/userMenuTree`, {}, { noLoading: true });
  return authMenuListData;
};


// 用户退出登录
export const logoutApi = () => {
  return useUserStore().clearUserInfo();
};


// /**
//  * @name 获取图像验证吗
//  */
// // 获取验证码
// export const getCaptcha = () => {
//   return http.get<any>(PORT + `/p1/auth/captcha`, {}, { noLoading: true });
// };