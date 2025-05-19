const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

// GET /api/alerts - 获取所有告警
router.get('/', alertController.getAllAlerts);

// GET /api/alerts/:id - 获取单个告警
router.get('/:id', alertController.getAlertById);

// POST /api/alerts - 创建新告警
router.post('/', alertController.createAlert);

// PUT /api/alerts/:id - 更新告警
router.put('/:id', alertController.updateAlert);

// DELETE /api/alerts/:id - 删除告警
router.delete('/:id', alertController.deleteAlert);

module.exports = router; 