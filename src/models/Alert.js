// src/models/Alert.js
const { DataTypes } = require('sequelize');
const { sequelize }  = require('../config/database');

/**
 * 告警模型  alerts
 * 对应表：anomaly_db.alerts   （小写，已在迁移脚本里显式创建）
 */
const Alert = sequelize.define(
  'Alert',
  {
    id: {
      type: DataTypes.BIGINT,          // 预留更大主键空间
      autoIncrement: true,
      primaryKey: true,
    },

    /* 业务字段 ---------------------------------------------------- */

    title:        { type: DataTypes.STRING,  allowNull: false },
    description:  { type: DataTypes.TEXT },
    severity:     { type: DataTypes.ENUM('low', 'medium', 'high', 'critical'), defaultValue: 'medium' },
    status:       { type: DataTypes.ENUM('new', 'acknowledged', 'resolved'),   defaultValue: 'new' },
    source:       { type: DataTypes.STRING, allowNull: false },
    metadata:     { type: DataTypes.JSON },
    timestamp:    { type: DataTypes.DATE,   allowNull: false },

    /* Sequelize 自动维护的时间戳 ↓（timestamps: true 时自动生成） */
    // createdAt
    // updatedAt
  },
  {
    tableName: 'alerts',  // **小写，固定表名**
    freezeTableName: true, // 禁止 Sequelize 再自动复数化或改大小写
    timestamps: true,      // 自动 createdAt / updatedAt
    underscored: false,    // 列名保持 camelCase
  }
);

module.exports = Alert;
