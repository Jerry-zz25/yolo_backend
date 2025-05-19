const { Detection, Alert } = require('../models');

/**
 * 获取所有检测结果
 * @route GET /api/detections
 */
exports.getAllDetections = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, source, detectionType, isAnomaly } = req.query;
    
    // 构建查询条件
    const where = {};
    if (source) where.source = source;
    if (detectionType) where.detectionType = detectionType;
    if (isAnomaly !== undefined) where.isAnomaly = isAnomaly === 'true';
    
    // 分页
    const offset = (page - 1) * limit;
    
    // 查询
    const detections = await Detection.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['timestamp', 'DESC']],
      include: [
        {
          model: Alert,
          as: 'alerts',
          attributes: ['id', 'title', 'severity']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: detections.count,
      data: detections.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(detections.count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个检测结果
 * @route GET /api/detections/:id
 */
exports.getDetectionById = async (req, res, next) => {
  try {
    const detection = await Detection.findByPk(req.params.id, {
      include: [
        {
          model: Alert,
          as: 'alerts'
        }
      ]
    });
    
    if (!detection) {
      return res.status(404).json({
        success: false,
        message: '找不到该检测结果'
      });
    }
    
    res.status(200).json({
      success: true,
      data: detection
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 创建新检测结果
 * @route POST /api/detections
 */
exports.createDetection = async (req, res, next) => {
  try {
    const detection = await Detection.create(req.body);
    
    // 如果是异常并且配置了自动创建告警，则创建关联告警
    if (detection.isAnomaly && req.body.createAlert) {
      await Alert.create({
        title: `${detection.detectionType} 异常`,
        description: `在 ${detection.source} 中检测到 ${detection.detectionType} 异常`,
        severity: req.body.alertSeverity || 'medium',
        source: detection.source,
        detectionId: detection.id,
        metadata: {
          anomalyScore: detection.anomalyScore,
          confidence: detection.confidence
        }
      });
    }
    
    res.status(201).json({
      success: true,
      data: detection
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新检测结果
 * @route PUT /api/detections/:id
 */
exports.updateDetection = async (req, res, next) => {
  try {
    const detection = await Detection.findByPk(req.params.id);
    
    if (!detection) {
      return res.status(404).json({
        success: false,
        message: '找不到该检测结果'
      });
    }
    
    await detection.update(req.body);
    
    res.status(200).json({
      success: true,
      data: detection
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除检测结果
 * @route DELETE /api/detections/:id
 */
exports.deleteDetection = async (req, res, next) => {
  try {
    const detection = await Detection.findByPk(req.params.id);
    
    if (!detection) {
      return res.status(404).json({
        success: false,
        message: '找不到该检测结果'
      });
    }
    
    await detection.destroy();
    
    res.status(200).json({
      success: true,
      message: '检测结果已成功删除'
    });
  } catch (error) {
    next(error);
  }
}; 