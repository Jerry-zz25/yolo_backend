// src/services/alertService.js
const Alert = require('../models/Alert');
const { sequelize } = require('../config/database');

/* ------------------------------------------------------------------ *
 |  基础 CRUD                                                          |
 * ------------------------------------------------------------------ */

/**
 * 分页 / 条件 查询告警
 * @param {Object}   query
 * @param {number}   query.page=1
 * @param {number}   query.limit=10
 * @param {string=}  query.severity
 * @param {string=}  query.status
 * @param {string=}  query.source
 */
exports.getAlerts = async ({
  page = 1,
  limit = 10,
  severity,
  status,
  source,
} = {}) => {
  const where = {};
  if (severity) where.severity = severity;
  if (status)   where.status   = status;
  if (source)   where.source   = source;

  const offset = (page - 1) * limit;

  return await Alert.findAndCountAll({
    where,
    limit:  parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['timestamp', 'DESC']],
  });
};

exports.getAlertById = (id) => Alert.findByPk(id);

/**
 * 创建告警
 * @param {{
 *   title: string,
 *   timestamp: Date|string,
 *   description?: string,
 *   severity?: 'low'|'medium'|'high'|'critical',
 *   status?: 'new'|'acknowledged'|'resolved',
 *   source?: string,
 *   metadata?: Object
 * }} data
 */
exports.createAlert = async (data) => {
  if (!data.timestamp) data.timestamp = new Date(); // 补默认时间戳
  return await Alert.create(data);
};

exports.updateAlert = async (id, data) => {
  const alert = await Alert.findByPk(id);
  if (!alert) return null;
  return await alert.update(data);
};

exports.deleteAlert = async (id) =>
  (await Alert.destroy({ where: { id } })) > 0;

/* ------------------------------------------------------------------ *
 |  高级工具：统计                                                     |
 * ------------------------------------------------------------------ */

/** 按 severity 统计告警数量 */
exports.countAlertsBySeverity = async () => {
  const rows = await Alert.findAll({
    attributes: [
      'severity',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    group: ['severity'],
  });

  const counts = {};
  rows.forEach((row) => {
    counts[row.severity] = Number(row.getDataValue('count'));
  });
  return counts; // 例如 { low: 3, medium: 7, high: 2 }
};
