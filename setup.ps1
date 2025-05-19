# 项目初始化脚本

# 1. 初始化npm项目
npm init -y

# 2. 安装项目依赖
npm install express sequelize mysql2 dotenv cors

# 3. 安装开发依赖
npm install -D jest eslint nodemon

# 4. 创建基础文件
New-Item -ItemType File -Path "server.js" -Force
New-Item -ItemType File -Path ".env" -Force
New-Item -ItemType File -Path ".gitignore" -Force

# 5. 向.gitignore添加基本内容
@"
# 依赖目录
node_modules/

# 环境变量
.env

# 日志
logs
*.log
npm-debug.log*

# 运行时数据
pids
*.pid
*.seed
*.pid.lock

# 测试覆盖率
coverage/

# IDE配置
.idea/
.vscode/
*.swp
*.swo

# 操作系统文件
.DS_Store
Thumbs.db
"@ | Out-File -FilePath ".gitignore" -Encoding utf8

# 6. 向.env添加基本环境变量
@"
# 应用配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=anomaly_detection
"@ | Out-File -FilePath ".env" -Encoding utf8

# 7. 创建基本的src目录结构
mkdir -p src/config src/models src/controllers src/services src/routes src/middleware src/utils src/ml/models src/ml/wasm

Write-Host "项目初始化完成！" -ForegroundColor Green 