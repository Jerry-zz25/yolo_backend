#!/bin/bash
# 执行此脚本需要权限：chmod +x deploy.sh
# 使用方式: ./deploy.sh [环境变量文件路径]

set -e  # 遇到错误立即退出
echo "开始部署应用..."

# 记录部署开始时间
START_TIME=$(date +%s)

# 切换到应用目录
APP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $APP_DIR
echo "当前目录: $(pwd)"

# 检查是否有环境变量文件参数
if [ $# -eq 1 ]; then
  ENV_FILE=$1
  if [ -f "$ENV_FILE" ]; then
    echo "使用环境变量文件: $ENV_FILE"
    cp "$ENV_FILE" .env
  else
    echo "警告: 指定的环境变量文件 $ENV_FILE 不存在！"
  fi
fi

# 拉取最新代码
echo "正在拉取最新代码..."
git pull origin main

# 安装依赖
echo "正在安装依赖..."
npm install

# 检查是否有构建脚本
if grep -q "\"build\":" package.json; then
  echo "正在构建应用..."
  npm run build
else
  echo "跳过构建 (未在package.json中找到build脚本)"
fi

# 重启PM2进程
echo "正在重启应用..."
pm2 restart api-server --update-env || pm2 start ecosystem.config.js

# 显示部署完成和耗时
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
echo "部署完成! 总耗时: ${DURATION}秒"

# 显示应用状态
pm2 status 