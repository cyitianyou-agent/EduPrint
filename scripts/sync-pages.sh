#!/usr/bin/env bash
set -euo pipefail

# 统一把 GitHub Pages 产物同步到 docs 目录。
# 设计目标：
# 1) 每次运行都先完整构建，确保产物来自最新源码。
# 2) 仅清理 docs/assets 下的旧构建资源，不影响 docs/superpowers 等文档目录。
# 3) 生成 docs/.nojekyll，避免 GitHub Pages 因 Jekyll 处理而忽略静态资源。
repoRoot="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repoRoot"

echo "[pages] 开始构建项目..."
npm run build

echo "[pages] 准备 docs 目录..."
mkdir -p docs
mkdir -p docs/assets

echo "[pages] 同步入口 HTML..."
cp -f dist/index.html docs/index.html

echo "[pages] 清理旧静态资源..."
find docs/assets -mindepth 1 -delete

echo "[pages] 同步新静态资源..."
cp -rf dist/assets/. docs/assets/

echo "[pages] 生成 .nojekyll..."
: > docs/.nojekyll

echo "[pages] 同步完成。"
