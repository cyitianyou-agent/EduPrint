# EduPrint

EduPrint 是一个基于 `Vue 3 + TypeScript + Vite + Pinia` 的小学数学打印练习单制作工具。  
当前已支持三类模板：

- AI生成计算题（规则出题）
- 凑十法
- 破十法

## 功能概览

- 左侧参数配置，右侧实时预览。
- 支持一次生成多页题目并直接打印。
- AI计算题支持多种出题方式混合：
  - 普通加法
  - 普通减法
  - 凑十法
  - 破十法

## 技术栈

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router

## 目录结构

- `src/`：业务源码
- `src/components/`：通用组件
- `src/views/`：页面与模板页
- `src/composables/`：出题逻辑
- `src/stores/`：状态管理
- `docs/`：GitHub Pages 发布目录与项目文档
- `docs/superpowers/`：设计与计划文档

## 本地开发

```bash
npm install
npm run dev
```

## 构建与预览

```bash
npm run build
npm run preview
```

## GitHub Pages 发布说明

本项目 GitHub Pages 使用以下固定发布源：

- 分支：`master`
- 目录：`/docs`

访问地址：

- `https://cyitianyou-agent.github.io/EduPrint/`

## Pages 产物同步流程

手动同步：

```bash
npm run pages:sync
```

该命令会：

- 先执行 `npm run build`
- 将 `dist/index.html` 同步到 `docs/index.html`
- 将 `dist/assets` 同步到 `docs/assets`
- 生成 `docs/.nojekyll`

安装推送前自动校验钩子（一次性）：

```bash
npm run hooks:install
```

安装后，推送 `master` 时会自动执行 Pages 同步校验；若 `docs` 产物有更新但未提交，会拦截本次 push 并提示先提交产物文件。

详细流程文档见：

- `docs/github-pages-workflow.md`
