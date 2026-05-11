# Repository Guidelines

## 项目结构与模块组织
- `src/`：应用源码目录。
- `src/components/`：通用界面组件（如 `MathControlPanel.vue`、`PageSheet.vue`）。
- `src/views/`：路由页面；`src/views/templates/`：各题型制作页。
- `src/stores/`：Pinia 状态管理（`worksheet.ts`）。
- `src/composables/`：题目生成逻辑（`generators.ts`）。
- `src/styles/main.css`：全局样式与打印样式。
- `原型图/`、`feedback/`：原型与对比截图。
- `docs/superpowers/`：设计与实施文档。

## 构建、测试与开发命令
- `npm install`：安装依赖。
- `npm run dev`：启动本地开发服务（Vite）。
- `npm run build`：类型检查并构建生产包。
- `npm run preview`：预览 `dist/` 构建结果。
- `npm run pages:sync`：构建并同步 GitHub Pages 产物到 `docs/`。
- `npm run hooks:install`：安装仓库级 hooks（含 `pre-push` 自动校验）。

示例：
```bash
npm install
npm run dev
```

## GitHub Pages 发布约定
- 发布源固定为 `master` 分支的 `docs/` 目录。
- 每次推送 `master` 前，需要保证 `docs/index.html`、`docs/assets/`、`docs/.nojekyll` 与当前源码构建结果一致。
- 推荐先执行 `npm run pages:sync`，再提交并推送。
- 详细流程见 `docs/github-pages-workflow.md`。

## 代码风格与命名规范
- 使用 TypeScript + Vue3 Composition API。
- 缩进 2 空格；每行只写一条语句。
- 变量与函数使用小驼峰（如 `pageCount`、`buildPages`）。
- 组件文件名使用 PascalCase（如 `MathEditor.vue`）。
- 业务逻辑放 `composables`，渲染逻辑放 `components`。
- 视觉敏感页面优先做最小改动，避免顺手重构。

## 测试与验收要求
- 当前未配置独立单元测试框架。
- 合并前最低要求：`npm run build` 必须通过。
- UI 改动需手动验证：
  - 多页生成是否正常。
  - 打印输出是否符合预期（`window.print`）。
  - 凑十法/破十法版式是否与 `原型图/` 对齐。
- 若新增自动化测试，建议命名为 `*.spec.ts`。

## 提交与合并请求规范
- 建议使用 Conventional Commit：`feat:`、`fix:`、`docs:`、`style:`。
- 提交信息应聚焦改动点，例如：`fix: 调整破十法分拆锚点`。
- PR 建议包含：
  - 改动摘要与影响范围。
  - 关键文件路径。
  - 样式改动前后截图。
  - 验证记录（至少包含 `npm run build`）。

## 安全与配置提示
- 不要提交密钥、令牌或其他敏感信息。
- 环境相关配置尽量本地化，避免硬编码机器路径。
- 大体积截图保留在参考目录，不要耦合进业务逻辑。
