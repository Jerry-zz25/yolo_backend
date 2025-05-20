// src/routes/alerts.js
const express = require('express');
const router  = express.Router();
const alertService = require('../services/alertService');

/* ------------------------- GET /api/alerts ------------------------- */
router.get('/', async (req, res) => {
  try {
    const result = await alertService.getAlerts(req.query); // page / limit / severity / status / source
    res.status(200).json({
      success: true,
      count:   result.count,
      data:    result.rows,
      page:    Number(req.query.page  || 1),
      limit:   Number(req.query.limit || 10),
      totalPages: Math.ceil(result.count / (req.query.limit || 10)),
    });
  } catch (err) {
    console.error('获取告警失败:', err);
    res.status(500).json({ error: '获取告警失败' });
  }
});

/* ------------------------- POST /api/alerts ------------------------ */
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      severity = 'medium',
      status   = 'new',
      source   = 'unknown',
      metadata,
      timestamp,
    } = req.body;

    if (!title || !timestamp) {
      return res.status(400).json({ error: '缺少必要字段：title, timestamp' });
    }

    const alert = await alertService.createAlert({
      title,
      description,
      severity,
      status,
      source,
      metadata,
      timestamp,
    });

    res.status(201).json(alert);
  } catch (err) {
    console.error('创建告警失败:', err);
    res.status(500).json({ error: '创建告警失败' });
  }
});

/* ------------------------ GET /api/alerts/:id ---------------------- */
router.get('/:id', async (req, res) => {
  try {
    const alert = await alertService.getAlertById(req.params.id);
    if (!alert) return res.status(404).json({ error: '找不到告警记录' });
    res.json(alert);
  } catch (err) {
    console.error('获取告警详情失败:', err);
    res.status(500).json({ error: '获取告警详情失败' });
  }
});

/* ---------------------- DELETE /api/alerts/:id --------------------- */
router.delete('/:id', async (req, res) => {
  try {
    const ok = await alertService.deleteAlert(req.params.id);
    if (!ok) return res.status(404).json({ error: '找不到告警记录' });
    res.json({ message: '告警删除成功' });
  } catch (err) {
    console.error('删除告警失败:', err);
    res.status(500).json({ error: '删除告警失败' });
  }
});

module.exports = router;
