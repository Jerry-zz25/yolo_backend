const express = require('express');
const router = express.Router();
const alertService = require('../services/alertService');

/**
 * @route GET /api/alerts
 * @desc 获取所有告警记录
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const alerts = await alertService.getAlerts();
    res.json(alerts);
  } catch (error) {
    console.error('获取告警失败:', error);
    res.status(500).json({ error: '获取告警失败' });
  }
});

/**
 * @route POST /api/alerts
 * @desc 创建新的告警记录
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    const { type, message, frameUrl } = req.body;
    
    // 基本验证
    if (!type || !message) {
      return res.status(400).json({ error: '缺少必要字段：type, message' });
    }
    
    // 创建告警
    const newAlert = await alertService.createAlert({ type, message, frameUrl });
    
    // 返回创建的告警，状态码 201（Created）
    res.status(201).json(newAlert);
  } catch (error) {
    console.error('创建告警失败:', error);
    res.status(500).json({ error: '创建告警失败' });
  }
});

/**
 * @route GET /api/alerts/:id
 * @desc 获取单个告警记录
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const alert = await alertService.getAlertById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ error: '找不到告警记录' });
    }
    
    res.json(alert);
  } catch (error) {
    console.error('获取告警详情失败:', error);
    res.status(500).json({ error: '获取告警详情失败' });
  }
});

/**
 * @route DELETE /api/alerts/:id
 * @desc 删除告警记录
 * @access Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await alertService.deleteAlert(req.params.id);
    
    if (!result) {
      return res.status(404).json({ error: '找不到告警记录' });
    }
    
    res.json({ message: '告警删除成功' });
  } catch (error) {
    console.error('删除告警失败:', error);
    res.status(500).json({ error: '删除告警失败' });
  }
});

module.exports = router; 