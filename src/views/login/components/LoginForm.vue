<template>
  <el-form
    ref="loginFormRef"
    :model="loginForm"
    :rules="loginRules"
    size="large"
  >
    <el-form-item prop="loginAccount">
      <el-input v-model="loginForm.loginAccount" placeholder="用户名">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="loginPassword">
      <el-input
        v-model="loginForm.loginPassword"
        type="password"
        placeholder="密码"
        show-password
        autocomplete="new-password"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="picCode">
      <!-- <el-input
        style="width: 65%"
        v-model="loginForm.picCode"
        size="large"
        placeholder="验证码"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <ChatDotRound />
          </el-icon>
        </template>
      </el-input>
      <div class="login-code">
        <img :src="codeUrl" @click="getCode" class="login-code-img" />
      </div> -->
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button
      :icon="CircleClose"
      round
      size="large"
      @click="resetForm(loginFormRef)"
    >
      重置
    </el-button>
    <el-button
      :icon="UserFilled"
      round
      size="large"
      type="primary"
      :loading="loading"
      @click="login(loginFormRef)"
    >
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts" name="LoginForm">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
import { getTimeState } from "@/utils";
import { ElNotification } from "element-plus";
import { loginApi } from "@/api/modules/login";
import { useUserStore } from "@/store/modules/user";
import { initDynamicRouter } from "@/router/modules/dynamicRouter";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import md5 from 'md5'

const router = useRouter();
const userStore = useUserStore();
type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  loginAccount: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  loginPassword: [{ required: true, message: "请输入密码", trigger: "blur" }],
  // picCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
});

const loading = ref(false);
const loginForm = reactive<any>({
  loginAccount: "admin",
  loginPassword: "123456",
});


// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1.执行登录接口
      const { data } = await loginApi({
        ...loginForm,
        password: md5(loginForm.loginPassword),
      });

      userStore.setToken(data.access_token);

      // userStore.randomcode = data.data!.inviteCode;

      // 2.添加动态路由
      await initDynamicRouter();

      // 3.跳转到首页
      router.push(HOME_URL);
      ElNotification({
        title: getTimeState(),
        message: `${userStore.roleName}欢迎登录！`,
        type: "success",
        duration: 3000,
      });

      // console.log("data", data);
    } finally {
      loading.value = false;
    }
  });
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

// getCode();
onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    e = (window.event as KeyboardEvent) || e;
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
