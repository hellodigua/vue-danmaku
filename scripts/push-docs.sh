#!/usr/bin/env sh

# 终止错误时脚本
set -e

# 获取当前分支名
current_branch=$(git symbolic-ref --short HEAD)

# 检查是否在main分支
# if [ "$current_branch" != "main" ]; then
#   echo "当前不在main分支，退出脚本"
#   exit 0
# fi

# 构建文档
npm run docs:build

# 进入构建输出目录
cd docs/.vitepress/dist

# 检查是否已经是git仓库
if [ ! -d ".git" ]; then
  echo "初始化git仓库..."
  git init
else
  echo "已经是git仓库，跳过初始化步骤..."
fi

git config user.name digua && git config user.email i@digua.me
git add -A
git commit -m 'docs: update documentation site'

# 推送到vue-danmaku-docs仓库的main分支
git push -f git@github.com:hellodigua/vue-danmaku-docs.git main

cd -

echo "文档已成功部署到 vue-danmaku-docs 仓库"
