<template>
  <div class="upload-box">
    <el-upload
      id="uploadQrCode"
      action="#"
      ref="uploadRef"
      :class="[
        'upload',
        self_disabled ? 'disabled' : '',
        drag ? 'no-border' : '',
      ]"
      :multiple="false"
      :disabled="self_disabled"
      list-type="picture-card"
      :show-file-list="false"
      :http-request="handleHttpUpload"
      :on-change="uploadChange"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :auto-upload="autoUpload"
      :drag="drag"
      :accept="fileType.join(',')"
    >
      <template v-if="file">
        <img :src="file.url" class="upload-image" />
        <div class="upload-handle" @click.stop>
          <div v-if="!self_disabled" class="handle-icon" @click="editImg">
            <el-icon><Edit /></el-icon>
            <span>编辑</span>
          </div>
          <div class="handle-icon" @click="imgViewVisible = true">
            <el-icon><ZoomIn /></el-icon>
            <span>查看</span>
          </div>
          <div v-if="!self_disabled" class="handle-icon" @click="deleteImg">
            <el-icon><Delete /></el-icon>
            <span>删除</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="upload-empty">
          <slot name="empty">
            <el-icon><Plus /></el-icon>
            <span>请上传图片</span>
          </slot>
        </div>
      </template>
    </el-upload>
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
    <el-image-viewer
      v-if="imgViewVisible"
      :url-list="[file!.url]"
      @close="imgViewVisible = false"
    />
  </div>
</template>

<script setup lang="ts" name="UploadImg">
import { ref, computed, inject } from "vue";
import {
  ElNotification,
  formContextKey,
} from "element-plus";
import type {
  UploadRequestOptions,
  UploadInstance,
  UploadFile,
} from "element-plus";

type ImageMimeType =
  | "image/apng"
  | "image/bmp"
  | "image/gif"
  | "image/jpeg"
  | "image/pjpeg"
  | "image/png"
  | "image/svg+xml"
  | "image/tiff"
  | "image/webp"
  | "image/x-icon";

interface UploadFileProps {
  file?: UploadFile | null; // 图片file对象 ==> 必传
  api?: (params: any) => Promise<any>; // 上传图片的 api 方法，一般项目上传都是同一个 api 方法，在组件里直接引入即可 ==> 非必传
  drag?: boolean; // 是否支持拖拽上传 ==> 非必传（默认为 false）
  disabled?: boolean; // 是否禁用上传组件 ==> 非必传（默认为 false）
  fileSize?: number; // 图片大小限制 ==> 非必传（默认为 5M）
  fileType?: ImageMimeType[]; // 图片类型限制 ==> 非必传（默认为 ["image/jpeg", "image/png", "image/gif"]）
  autoUpload?: boolean; // 是否自动上传 ==> 非必传（默认为 true）
  height?: string; // 组件高度 ==> 非必传（默认为 150px）
  width?: string; // 组件宽度 ==> 非必传（默认为 150px）
  borderRadius?: string; // 组件边框圆角 ==> 非必传（默认为 8px）
}

// 接受父组件参数
const props = withDefaults(defineProps<UploadFileProps>(), {
  autoUpload: true,
  api: () => Promise.resolve(),
  drag: false,
  disabled: false,
  fileSize: 3,
  fileType: () => ["image/jpeg", "image/png", "image/gif"],
  height: "150px",
  width: "150px",
  borderRadius: "8px",
});

// 查看图片
const imgViewVisible = ref(false);
// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0);
// 判断是否禁用上传和删除
const self_disabled = computed(() => {
  return props.disabled || formContext?.disabled;
});

/*
 * @description 图片发生改变
 * @param file 当前图片
 * */
const uploadChange = (file: UploadFile) => {
  console.log(file);
  
  // 文件上传前钩子
  props.file = file
  beforeUpload(file);
  emit("update:file", file);
};

/**
 * @description 图片上传
 * @param options upload 所有配置项
 * */
interface UploadEmits {
  (e: "update:file", value: UploadFile | null): void;
}
const emit = defineEmits<UploadEmits>();
/** TODO 未完成 */
const handleHttpUpload = async (options: UploadRequestOptions) => {
  let formData = new FormData();
  formData.append("file", options.file);
  // try {
  //   const { data } = await props.api(formData);
  //   emit("update:file", data.fileUrl);
  //   // 调用 el-form 内部的校验方法（可自动校验）
  //   formItemContext?.prop &&
  //     formContext?.validateField([formItemContext.prop as string]);
  // } catch (error) {
  //   options.onError(error as any);
  // }
};

/**
 * @description 删除图片
 * */
const uploadRef = ref<UploadInstance>()
const deleteImg = () => {
  uploadRef.value?.clearFiles();
  // 清除 el-upload 组件的 file 属性
  emit("update:file", null );
  // emit("update:imageUrl", "" );
};

/**
 * @description 编辑图片
 * */
const editImg = () => {
  const dom = document.querySelector(`#uploadQrCode .el-upload__input`);
  dom && dom.dispatchEvent(new MouseEvent("click"));
};

/**
 * @description 文件上传之前判断
 * @param rawFile 选择的文件
 * */
const beforeUpload = (rawFile : UploadFile) => {
  const imgSize = rawFile.size! / 1024 / 1024 < props.fileSize;
  const imgType = props.fileType.includes(rawFile.raw?.type as ImageMimeType);
  if (!imgType)
    ElNotification({
      title: "温馨提示",
      message: "上传图片不符合所需的格式！",
      type: "warning",
    });
    uploadRef.value?.clearFiles();
  if (!imgSize)
    setTimeout(() => {
      ElNotification({
        title: "温馨提示",
        message: `上传图片大小不能超过 ${props.fileSize}M！`,
        type: "warning",
      });
      uploadRef.value?.clearFiles();
      emit("update:file", null );
    }, 0);
  return imgType && imgSize;
};

/**
 * @description 图片上传成功
 * */
const uploadSuccess = () => {
  ElNotification({
    title: "温馨提示",
    message: "图片上传成功！",
    type: "success",
  });
};

/**
 * @description 图片上传错误
 * */
const uploadError = () => {
  ElNotification({
    title: "温馨提示",
    message: "图片上传失败，请您重新上传！",
    type: "error",
  });
};
</script>

<style scoped lang="scss">
.is-error {
  .upload {
    :deep(.el-upload),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;
      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}
:deep(.disabled) {
  .el-upload,
  .el-upload-dragger {
    cursor: not-allowed !important;
    background: var(--el-disabled-bg-color);
    border: 1px dashed var(--el-border-color-darker) !important;
    &:hover {
      border: 1px dashed var(--el-border-color-darker) !important;
    }
  }
}
.upload-box {
  .no-border {
    :deep(.el-upload) {
      border: none !important;
    }
  }
  :deep(.upload) {
    .el-upload {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: v-bind(width);
      height: v-bind(height);
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderRadius);
      transition: var(--el-transition-duration-fast);
      &:hover {
        border-color: var(--el-color-primary);
        .upload-handle {
          opacity: 1;
        }
      }
      .el-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
        background-color: transparent;
        border: 1px dashed var(--el-border-color-darker);
        border-radius: v-bind(borderRadius);
        &:hover {
          border: 1px dashed var(--el-color-primary);
        }
      }
      .el-upload-dragger.is-dragover {
        background-color: var(--el-color-primary-light-9);
        border: 2px dashed var(--el-color-primary) !important;
      }
      .upload-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .upload-empty {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        line-height: 30px;
        color: var(--el-color-info);
        .el-icon {
          font-size: 28px;
          color: var(--el-text-color-secondary);
        }
      }
      .upload-handle {
        position: absolute;
        top: 0;
        right: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: rgb(0 0 0 / 60%);
        opacity: 0;
        transition: var(--el-transition-duration-fast);
        .handle-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 6%;
          color: aliceblue;
          .el-icon {
            margin-bottom: 40%;
            font-size: 130%;
            line-height: 130%;
          }
          span {
            font-size: 85%;
            line-height: 85%;
          }
        }
      }
    }
  }
  .el-upload__tip {
    line-height: 18px;
    text-align: center;
  }
}
</style>
