const { sequelize } = require('../config/database');
const Alert = require('./Alert');
const Detection = require('./Detection');

// 定义模型关联关系
Detection.hasMany(Alert, {
  foreignKey: 'detectionId',
  as: 'alerts'
});

Alert.belongsTo(Detection, {
  foreignKey: 'detectionId',
  as: 'detection'
});

// 同步数据库模型
const syncModels = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('数据库模型同步完成');
  } catch (error) {
    console.error('数据库模型同步失败:', error);
    throw error;
  }
};

// 初始化数据库连接和模型
const initDatabase = async (force = false) => {
  try {
    // 首先测试数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 然后同步模型
    await syncModels({ force });
    return true;
  } catch (error) {
    console.error('初始化数据库失败:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  Alert,
  Detection,
  syncModels,
  initDatabase
}; 