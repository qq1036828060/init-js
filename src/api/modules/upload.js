import { PORT } from "@/config";
import http from "@/api";

/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadImg = (params) => {
  return http.post(PORT + `/file/upload/img`, params);
};

// 视频上传
export const uploadVideo = (params) => {
  return http.post(PORT + `/file/upload/video`, params);
};
