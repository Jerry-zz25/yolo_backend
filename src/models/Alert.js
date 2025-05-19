const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * 告警模型
 * 用于存储系统告警信息
 */
const Alert = sequelize.define('Alert', {
  // 自增主键
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // 告警级别
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  // 告警状态
  status: {
    type: DataTypes.ENUM('new', 'acknowledged', 'resolved'),
    defaultValue: 'new'
  },
  // 告警来源
  source: {
    type: DataTypes.STRING,
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  // 告警时间
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'alerts',
  timestamps: true
});

module.exports = Alert; 