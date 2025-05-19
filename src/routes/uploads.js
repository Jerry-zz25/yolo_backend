const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const s3Service = require('../services/s3Service');
const Alert = require('../models/Alert');

/**
 * POST /api/uploads/frames
 * 上传帧图像到 S3，并可选择性地创建告警
 */
router.post('/frames', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '没有提供文件'
      });
    }

    // 上传文件到 S3
    const uploadResult = await s3Service.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // 如果请求中包含告警信息，创建告警记录
    if (req.body.createAlert === 'true') {
      const alertData = {
        type: req.body.alertType || 'frame_alert',
        message: req.body.alertMessage || '检测到新帧',
        frameUrl: uploadResult.url
      };

      const alert = await Alert.create(alertData);

      return res.status(201).json({
        success: true,
        message: '文件上传成功并创建了告警',
        data: {
          fileUrl: uploadResult.url,
          fileKey: uploadResult.key,
          alert
        }
      });
    }

    // 仅返回上传结果
    res.status(200).json({
      success: true,
      message: '文件上传成功',
      data: {
        fileUrl: uploadResult.url,
        fileKey: uploadResult.key
      }
    });
  } catch (error) {
    console.error('文件上传处理错误:', error);
    res.status(500).json({
      success: false,
      message: '文件上传失败',
      error: error.message
    });
  }
});

/**
 * GET /api/uploads/signed-url
 * 获取预签名 URL，用于前端直接上传到 S3
 */
router.get('/signed-url', async (req, res) => {
  try {
    const { fileName, fileType } = req.query;

    if (!fileName || !fileType) {
      return res.status(400).json({
        success: false,
        message: '文件名和类型是必需的'
      });
    }

    // 生成预签名 URL
    const urlData = await s3Service.getSignedUrl(fileName, fileType);

    res.status(200).json({
      success: true,
      data: urlData
    });
  } catch (error) {
    console.error('生成预签名 URL 错误:', error);
    res.status(500).json({
      success: false,
      message: '生成预签名 URL 失败',
      error: error.message
    });
  }
});

module.exports = router; 