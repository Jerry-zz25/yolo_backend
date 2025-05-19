const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 初始化 Express 应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 简单的状态检查路由
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// 导入路由
const alertRoutes = require('./routes/alertRoutes');
const detectionRoutes = require('./routes/detectionRoutes');

// 注册路由
app.use('/api/alerts', alertRoutes);
app.use('/api/detections', detectionRoutes);

// 处理 404
app.use((req, res, next) => {
  res.status(404).json({ message: '资源未找到' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || '服务器内部错误'
  });
});

module.exports = app; 