const { s3, bucketName } = require('../config/s3Config');
const { v4: uuidv4 } = require('uuid');

/**
 * S3 服务类
 * 负责处理与 S3 相关的操作
 */
class S3Service {
  /**
   * 上传文件到 S3
   * @param {Buffer} fileBuffer - 文件数据缓冲区
   * @param {string} originalName - 原始文件名
   * @param {string} mimeType - 文件类型
   * @returns {Promise<{url: string, key: string}>} 上传结果
   */
  async uploadFile(fileBuffer, originalName, mimeType) {
    // 从原始文件名中提取文件扩展名
    const fileExtension = originalName.split('.').pop().toLowerCase();
    
    // 生成唯一的对象键
    const objectKey = `frames/${Date.now()}-${uuidv4()}.${fileExtension}`;
    
    // 上传参数
    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: mimeType
    };
    
    try {
      // 上传文件到 S3
      const result = await s3.upload(params).promise();
      
      return {
        url: result.Location, // S3 返回的文件 URL
        key: objectKey        // S3 对象键
      };
    } catch (error) {
      console.error('S3 上传错误:', error);
      throw new Error(`文件上传到 S3 失败: ${error.message}`);
    }
  }
  
  /**
   * 获取文件的预签名 URL（用于直接从前端上传）
   * @param {string} fileName - 文件名
   * @param {string} fileType - 文件类型
   * @param {number} expiresIn - URL 有效期（秒），默认 300 秒
   * @returns {Promise<{signedUrl: string, url: string, key: string}>} 签名 URL 和最终文件 URL
   */
  async getSignedUrl(fileName, fileType, expiresIn = 300) {
    // 从文件名中提取文件扩展名
    const fileExtension = fileName.split('.').pop().toLowerCase();
    
    // 生成唯一的对象键
    const objectKey = `uploads/${Date.now()}-${uuidv4()}.${fileExtension}`;
    
    // 生成预签名 URL
    const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: objectKey,
      ContentType: fileType,
      Expires: expiresIn
    });
    
    // 构建最终的访问 URL
    const url = `https://${bucketName}.s3.amazonaws.com/${objectKey}`;
    
    return {
      signedUrl,
      url,
      key: objectKey
    };
  }
  
  /**
   * 删除 S3 中的文件
   * @param {string} objectKey - S3 对象键
   * @returns {Promise<boolean>} 操作结果
   */
  async deleteFile(objectKey) {
    const params = {
      Bucket: bucketName,
      Key: objectKey
    };
    
    try {
      await s3.deleteObject(params).promise();
      return true;
    } catch (error) {
      console.error('S3 删除错误:', error);
      throw new Error(`从 S3 删除文件失败: ${error.message}`);
    }
  }
}

module.exports = new S3Service(); 