const Alert = require('../models/Alert');
const { sequelize } = require('../config/database');

/**
 * 获取所有告警记录
 * @returns {Promise<Array>} 告警记录数组
 */
exports.getAlerts = async () => {
  return await Alert.findAll({
    order: [['timestamp', 'DESC']]
  });
};

/**
 * 根据ID获取单个告警记录
 * @param {string} id 告警ID
 * @returns {Promise<Object|null>} 告警记录或null
 */
exports.getAlertById = async (id) => {
  return await Alert.findByPk(id);
};

/**
 * 创建新的告警记录
 * @param {Object} alertData 告警数据
 * @param {string} alertData.type 告警类型
 * @param {string} alertData.message 告警消息
 * @param {string} [alertData.frameUrl] 图像帧URL
 * @returns {Promise<Object>} 创建的告警记录
 */
exports.createAlert = async (alertData) => {
  // 添加时间戳（如果未提供）
  if (!alertData.timestamp) {
    alertData.timestamp = new Date();
  }
  
  return await Alert.create(alertData);
};

/**
 * 更新告警记录
 * @param {string} id 告警ID
 * @param {Object} updateData 更新的数据
 * @returns {Promise<Object|null>} 更新后的告警记录或null
 */
exports.updateAlert = async (id, updateData) => {
  const alert = await Alert.findByPk(id);
  
  if (!alert) {
    return null;
  }
  
  return await alert.update(updateData);
};

/**
 * 删除告警记录
 * @param {string} id 告警ID
 * @returns {Promise<boolean>} 是否成功删除
 */
exports.deleteAlert = async (id) => {
  const numDeleted = await Alert.destroy({
    where: { id }
  });
  
  return numDeleted > 0;
};

/**
 * 按类型统计告警
 * @returns {Promise<Object>} 按类型统计的告警数量
 */
exports.countAlertsByType = async () => {
  const results = await Alert.findAll({
    attributes: [
      'type',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['type']
  });
  
  const counts = {};
  results.forEach(result => {
    counts[result.type] = result.getDataValue('count');
  });
  
  return counts;
}; 