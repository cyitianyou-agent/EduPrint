#!/usr/bin/env bash
set -euo pipefail

# 把仓库内版本化的 hooks 目录注册为 Git hooksPath。
# 这样团队成员拉取代码后执行一次安装命令，就能启用相同的 pre-push 规则。
repoRoot="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repoRoot"

chmod +x .githooks/pre-push
git config core.hooksPath .githooks

echo "[hooks] 已启用仓库 hooks 目录：.githooks"
echo "[hooks] 当前 hooksPath：$(git config core.hooksPath)"
