const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * 检测结果模型
 * 用于存储异常检测结果
 */
const Detection = sequelize.define('Detection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  frameId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '帧标识符，可以是文件名或外部存储引用'
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '检测时间'
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '检测源（如摄像头ID、视频源等）'
  },
  detectionType: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '检测类型（如人员、车辆、火灾等）'
  },
  confidence: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: '检测置信度'
  },
  boundingBox: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '目标边界框坐标 [x, y, width, height]'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '其他检测元数据'
  },
  isAnomaly: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否是异常'
  },
  anomalyScore: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: '异常分数'
  }
}, {
  tableName: 'detections',
  timestamps: true,
  indexes: [
    {
      fields: ['frameId']
    },
    {
      fields: ['timestamp']
    },
    {
      fields: ['source']
    },
    {
      fields: ['detectionType']
    },
    {
      fields: ['isAnomaly']
    }
  ]
});

module.exports = Detection; 