# Automated Anomaly Detection System

基于 Node.js 和 Express 的自动异常检测系统后端。该系统能够存储和管理检测结果和告警，以及（未来）集成 YOLO 模型进行实时异常检测。

## 技术栈

- **后端框架**: Node.js + Express
- **数据库**: MySQL (AWS RDS)
- **ORM**: Sequelize
- **部署**: AWS EC2

## 项目结构

```
/anomaly-detection-backend
├── src/                   # 源代码目录
│   ├── config/            # 配置文件目录
│   │   └── database.js    # 数据库连接配置
│   ├── controllers/       # 控制器层
│   │   ├── alertController.js    # 告警API控制器
│   │   └── detectionController.js # 检测结果API控制器
│   ├── models/            # 数据模型
│   │   ├── index.js       # 模型导出和关联
│   │   ├── Alert.js       # 告警模型
│   │   └── Detection.js   # 检测结果模型
│   ├── routes/            # 路由定义
│   │   ├── alertRoutes.js # 告警路由
│   │   └── detectionRoutes.js # 检测结果路由
│   ├── services/          # 业务逻辑层（可选）
│   ├── middleware/        # 中间件
│   │   └── error.js       # 错误处理中间件
│   ├── utils/             # 工具函数
│   │   └── logger.js      # 日志工具
│   ├── ml/                # 机器学习模块（未来扩展）
│   │   └── inference.js   # 推理逻辑
│   └── app.js             # Express应用配置
└── server.js              # 应用入口点
```

## 功能特性

- 完整的 RESTful API 接口：`/api/alerts` 和 `/api/detections`
- 基于 MySQL 的持久化存储
- 解耦的数据模型和控制器
- 异常检测结果存储和查询
- 告警管理和通知（将来扩展）
- 未来可集成 WASM/WebGPU 加载 YOLO 模型进行实时检测

## API 接口

### 告警接口 (`/api/alerts`)

- `GET /api/alerts` - 获取所有告警（支持分页和过滤）
- `GET /api/alerts/:id` - 获取单个告警详情
- `POST /api/alerts` - 创建新告警
- `PUT /api/alerts/:id` - 更新告警
- `DELETE /api/alerts/:id` - 删除告警

### 检测结果接口 (`/api/detections`)

- `GET /api/detections` - 获取所有检测结果（支持分页和过滤）
- `GET /api/detections/:id` - 获取单个检测结果详情
- `POST /api/detections` - 添加新的检测结果
- `PUT /api/detections/:id` - 更新检测结果
- `DELETE /api/detections/:id` - 删除检测结果

## 安装与运行

### 准备工作

1. 确保已安装 Node.js (v14+) 和 npm
2. 设置 MySQL 数据库（本地或 AWS RDS）

### 安装步骤

1. 克隆代码库
   ```bash
   git clone <repository-url>
   cd anomaly-detection-backend
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 配置环境变量
   创建 `.env` 文件，包含以下内容：
   ```
   PORT=3000
   NODE_ENV=development
   
   # 数据库配置
   DB_HOST=your-db-host
   DB_PORT=3306
   DB_USER=your-username
   DB_PASS=your-password
   DB_NAME=anomaly_detection_db
   ```

4. 运行应用
   ```bash
   # 开发模式
   npm run dev
   
   # 生产模式
   npm start
   ```

## 开发

### 数据库同步

首次运行应用时，数据库表会自动创建。如果需要手动同步数据库模型，可以使用：
```javascript
const { syncModels } = require('./src/models');
syncModels(true); // 传入 true 将强制重建表（谨慎使用）
```

### 测试

```bash
npm test
```

## 部署

项目设计为部署在 AWS EC2 实例上，连接到 AWS RDS MySQL 数据库。详细部署步骤请参考部署文档。

## 扩展计划

- 集成 WebAssembly 的 YOLO 模型加载
- 实时视频流分析
- 基于 WebSocket 的实时告警通知
- 添加统计分析功能 