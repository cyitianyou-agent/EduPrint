/**
 * Vite 构建配置：
 * 当前保持最小配置，核心目标是稳定支撑 Vue3 + TS 开发。
 * 若后续引入路径别名、代理、分包策略，可在此按需扩展。
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  // GitHub Pages 项目站点路径（https://<user>.github.io/EduPrint/）。
  // 使用仓库名作为 base，确保构建后静态资源路径正确。
  base: "/EduPrint/",
  // Vue 单文件组件编译插件（template/script/style）。
  plugins: [vue()]
});
