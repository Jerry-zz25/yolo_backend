const { Alert, Detection } = require('../models');

/**
 * 获取所有告警
 * @route GET /api/alerts
 */
exports.getAllAlerts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, severity, status, source } = req.query;
    
    // 构建查询条件
    const where = {};
    if (severity) where.severity = severity;
    if (status) where.status = status;
    if (source) where.source = source;
    
    // 分页
    const offset = (page - 1) * limit;
    
    // 查询
    const alerts = await Alert.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['timestamp', 'DESC']],
      include: [
        {
          model: Detection,
          as: 'detection',
          attributes: ['id', 'frameId', 'source', 'detectionType']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: alerts.count,
      data: alerts.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(alerts.count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个告警
 * @route GET /api/alerts/:id
 */
exports.getAlertById = async (req, res, next) => {
  try {
    const alert = await Alert.findByPk(req.params.id, {
      include: [
        {
          model: Detection,
          as: 'detection',
          attributes: ['id', 'frameId', 'source', 'detectionType', 'boundingBox']
        }
      ]
    });
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: '找不到该告警'
      });
    }
    
    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 创建新告警
 * @route POST /api/alerts
 */
exports.createAlert = async (req, res, next) => {
  try {
    const alert = await Alert.create(req.body);
    
    res.status(201).json({
      success: true,
      data: alert
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新告警
 * @route PUT /api/alerts/:id
 */
exports.updateAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: '找不到该告警'
      });
    }
    
    await alert.update(req.body);
    
    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除告警
 * @route DELETE /api/alerts/:id
 */
exports.deleteAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: '找不到该告警'
      });
    }
    
    await alert.destroy();
    
    res.status(200).json({
      success: true,
      message: '告警已成功删除'
    });
  } catch (error) {
    next(error);
  }
}; 