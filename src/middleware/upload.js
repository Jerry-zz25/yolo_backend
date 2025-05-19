const multer = require('multer');
const path = require('path');

// 配置内存存储
const storage = multer.memoryStorage();

// 文件过滤器，限制文件类型
const fileFilter = (req, file, cb) => {
  // 允许的文件类型
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/quicktime'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型。仅支持 JPEG, PNG, GIF 图像和 MP4, MOV 视频。'), false);
  }
};

// 配置 multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 大小限制
  }
});

module.exports = {
  upload
}; 