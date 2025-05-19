const express = require('express');
const router = express.Router();
const Detection = require('../models/Detection');
const { sequelize } = require('../config/database');

/**
 * GET /api/detections
 * 获取所有检测结果
 */
router.get('/', async (req, res) => {
  try {
    const detections = await Detection.findAll({
      order: [['detectedAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: detections.length,
      data: detections
    });
  } catch (error) {
    console.error('获取检测结果失败:', error);
    res.status(500).json({
      success: false,
      message: '获取检测结果失败',
      error: error.message
    });
  }
});

/**
 * POST /api/detections
 * 批量插入检测结果
 * 请求体格式: 检测结果对象数组
 */
router.post('/', async (req, res) => {
  // 确保请求体是数组
  if (!Array.isArray(req.body)) {
    return res.status(400).json({
      success: false,
      message: '请求体必须是数组'
    });
  }
  
  // 如果数组为空，直接返回成功
  if (req.body.length === 0) {
    return res.status(201).json({
      success: true,
      count: 0,
      data: []
    });
  }
  
  const transaction = await sequelize.transaction();
  
  try {
    // 批量创建检测结果
    const detections = await Detection.bulkCreate(req.body, {
      transaction,
      validate: true
    });
    
    // 提交事务
    await transaction.commit();
    
    res.status(201).json({
      success: true,
      count: detections.length,
      data: detections
    });
  } catch (error) {
    // 如果出错，回滚事务
    await transaction.rollback();
    
    console.error('批量创建检测结果失败:', error);
    res.status(400).json({
      success: false,
      message: '批量创建检测结果失败',
      error: error.message
    });
  }
});

module.exports = router; 