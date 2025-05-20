const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const path      = require('path');
const { Sequelize } = require('sequelize');

dotenv.config();

// —— 新增数据库连接 —— 
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host:     process.env.DB_HOST,
    port:     Number(process.env.DB_PORT) || 3306,
    dialect:  'mysql',
    logging:  false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log('✅ DB connected'))
  .catch(err => {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  });
// 导入路由模块
const app = require('./src/app'); 
const detectionsRouter = require('./src/routes/detections');
const uploadsRouter = require('./src/routes/uploads');

// 加载环境变量
dotenv.config();

// 初始化 Express 应用
const app = express();

// 配置 CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'src/public')));

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 挂载 API 路由

app.use('/api/detections', detectionsRouter);
app.use('/api/uploads', uploadsRouter);

// 首页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/index.html'));
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ message: '资源未找到' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || '服务器内部错误'
  });
});

// 设置端口
const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});
