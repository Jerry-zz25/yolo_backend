const express = require('express');
const router = express.Router();
const detectionController = require('../controllers/detectionController');

// GET /api/detections - 获取所有检测结果
router.get('/', detectionController.getAllDetections);

// GET /api/detections/:id - 获取单个检测结果
router.get('/:id', detectionController.getDetectionById);

// POST /api/detections - 创建新检测结果
router.post('/', detectionController.createDetection);

// PUT /api/detections/:id - 更新检测结果
router.put('/:id', detectionController.updateDetection);

// DELETE /api/detections/:id - 删除检测结果
router.delete('/:id', detectionController.deleteDetection);

module.exports = router; 