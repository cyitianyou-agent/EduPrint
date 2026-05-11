# GitHub Pages 固化流程

## 目标

- 使用 `master` 分支的 `docs/` 目录作为 GitHub Pages 发布源。
- 每次推送 `master` 前，自动确保 `docs/index.html` 与 `docs/assets` 来自最新构建产物。
- 若产物过期，自动拦截 push，避免线上页面和源码不一致。

## 一次性初始化

```bash
npm run hooks:install
```

该命令会执行以下动作：

- 将仓库内 `.githooks` 注册为 Git hooks 目录。
- 启用 `.githooks/pre-push` 推送前校验。

## 日常命令

手动同步 Pages 产物：

```bash
npm run pages:sync
```

执行内容：

- 先运行 `npm run build`。
- 用 `dist/index.html` 覆盖 `docs/index.html`。
- 清理 `docs/assets` 旧文件并拷贝最新构建资源。
- 生成 `docs/.nojekyll`。

## 推送行为

当你执行 `git push` 且目标包含 `master` 时：

- `pre-push` 会自动执行 `npm run pages:sync`。
- 若 `docs` 产物没有变化，push 正常继续。
- 若 `docs` 产物发生变化，push 会被拦截，并提示先提交生成文件。

## 被拦截后的处理

```bash
git add docs/index.html docs/assets docs/.nojekyll
git commit -m "chore: 同步 GitHub Pages 产物"
git push
```
