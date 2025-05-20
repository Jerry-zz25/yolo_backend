// server.js
require('dotenv').config();               // 顶部一次即可

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { Sequelize } = require('sequelize');

/* -------------------------- DB connection ------------------------- */
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

sequelize.authenticate()
  .then(() => console.log('✅ DB connected'))
  .catch(err => {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  });

/* -------------------------- Express app --------------------------- */
const app = express();

/* ----------------------------- CORS ------------------------------ */
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}));

/* --------------------------- Middlewares ------------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'src/public')));

/* ---------------------------- Routers ---------------------------- */
const alertsRouter     = require('./src/routes/alerts');      // ✅ 新路由
const detectionsRouter = require('./src/routes/detections');
const uploadsRouter    = require('./src/routes/uploads');

console.log('Loaded alerts route file:', require.resolve('./src/routes/alerts'));

app.use('/api/alerts',     alertsRouter);     // 只挂载一次
app.use('/api/detections', detectionsRouter);
app.use('/api/uploads',    uploadsRouter);

/* -------------------------- Health Check ------------------------- */
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

/* ------------------------------ Home ----------------------------- */
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'src/public/index.html')));

/* ------------------------ 404 & Error ---------------------------- */
app.use((req, res) => res.status(404).json({ message: '资源未找到' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    status:  'error',
    message: err.message || '服务器内部错误',
  });
});

/* --------------------------- Start Up ---------------------------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 服务器运行在 http://0.0.0.0:${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});
