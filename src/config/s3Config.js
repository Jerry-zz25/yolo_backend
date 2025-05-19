const AWS = require('aws-sdk');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 配置 AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

// 创建 S3 服务实例
const s3 = new AWS.S3();

// S3 桶名
const bucketName = process.env.S3_BUCKET_NAME;

module.exports = {
  s3,
  bucketName
}; 