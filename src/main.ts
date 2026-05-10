/**
 * 应用入口：负责装配全局能力并挂载到 DOM。
 * 这里不放业务逻辑，便于后续替换路由、状态方案时最小化影响。
 */
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { router } from "./router";
import "./styles/main.css";

// 创建根实例。这里以 App 作为全局容器，内部再通过 RouterView 切换页面。
const app = createApp(App);

// Pinia 作为全局状态容器，负责跨页面保存配置与生成结果。
const pinia = createPinia();

// 先注册插件再挂载，确保组件在 setup 阶段即可访问 store/router。
app.use(pinia);
app.use(router);

// 固定挂载到 index.html 的 #app 节点。
app.mount("#app");
