#!/bin/bash -xe
# EC2实例启动时执行的用户数据脚本

# 更新系统
apt-get update -y
apt-get upgrade -y

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt-get install -y nodejs

# 安装Git和其他必要工具
apt-get install -y git build-essential

# 安装PM2进程管理器
npm install -g pm2

# 创建应用目录
APP_DIR="/home/ubuntu/anomaly-detection-backend"
mkdir -p $APP_DIR
chown -R ubuntu:ubuntu $APP_DIR

# 切换到ubuntu用户并设置应用
sudo -u ubuntu bash << 'EOL'
cd $APP_DIR

# 克隆应用代码库
git clone https://github.com/your-username/anomaly-detection-backend.git .

# 安装依赖
npm install

# 复制部署脚本
cat > deploy.sh << 'EOF'
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
EOF

chmod +x deploy.sh

# 创建PM2配置文件
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'api-server',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# 创建示例.env文件
cat > .env.example << 'EOF'
# 服务器配置
PORT=3000
NODE_ENV=production

# 数据库配置
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=3306
DB_NAME=anomalydb
DB_USER=admin
DB_PASSWORD=YourStrongPassword123

# JWT配置
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=24h

# AWS配置
AWS_REGION=ap-southeast-1
AWS_BUCKET_NAME=your-s3-bucket-name
EOF
EOL

# 完成安装
echo "EC2实例初始化完成" 