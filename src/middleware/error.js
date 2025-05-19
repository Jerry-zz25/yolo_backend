/**
 * 错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  let error = { ...err };
  error.message = err.message;
  
  // Sequelize 错误处理
  // 验证错误
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message).join(', ');
    error.message = message;
    error.statusCode = 400;
  }
  
  // 唯一约束错误
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = '数据已存在，请检查唯一字段';
    error.message = message;
    error.statusCode = 400;
  }
  
  // 外键约束错误
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = '外键约束错误，请检查关联数据是否存在';
    error.message = message;
    error.statusCode = 400;
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || '服务器错误',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler; 