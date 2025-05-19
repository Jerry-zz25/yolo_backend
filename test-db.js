// test-db.js (改为 CommonJS，确保能直接执行)
const path = require('path');
// 指定从根目录加载 .env
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// 打印确认
console.log('🔍 Loaded ENV:');
console.log('DB_HOST =', process.env.DB_HOST);
console.log('DB_PORT =', process.env.DB_PORT);

const { Sequelize } = require('sequelize');

(async () => {
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      dialect: 'mysql',
      logging: false,
    }
  );
  try {
    await sequelize.authenticate();
    console.log('✅ 成功连接到数据库');
  } catch (err) {
    console.error('❌ 连接到数据库失败：', err);
  } finally {
    await sequelize.close();
  }
})();
