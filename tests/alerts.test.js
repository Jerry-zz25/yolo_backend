const request = require('supertest');
const express = require('express');
const alertRoutes = require('../src/routes/alerts');
const alertService = require('../src/services/alertService');

// 模拟 alertService
jest.mock('../src/services/alertService');

// 创建一个 Express 应用实例用于测试
const app = express();
app.use(express.json());
app.use('/api/alerts', alertRoutes);

describe('Alerts API', () => {
  // 在所有测试开始前设置测试环境
  beforeAll(() => {
    if (global.setupTestEnvironment) {
      global.setupTestEnvironment();
    }
  });

  // 在所有测试结束后清理测试环境
  afterAll(() => {
    if (global.cleanupTestEnvironment) {
      global.cleanupTestEnvironment();
    }
  });

  beforeEach(() => {
    // 在每个测试前重置所有模拟
    jest.clearAllMocks();
  });

  describe('GET /api/alerts', () => {
    it('应该返回空数组，当数据库中没有告警时', async () => {
      // 设置 getAlerts 方法的模拟实现，返回空数组
      alertService.getAlerts.mockResolvedValue([]);
      
      // 发送请求并验证响应
      const response = await request(app)
        .get('/api/alerts')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // 验证响应体为空数组
      expect(response.body).toEqual([]);
      
      // 验证 getAlerts 方法被调用了一次
      expect(alertService.getAlerts).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/alerts', () => {
    it('应该创建一个新的告警并返回 201 状态码和新记录', async () => {
      // 模拟要创建的告警数据
      const newAlert = {
        type: 'warning',
        message: '检测到异常行为',
        frameUrl: 'https://example.com/frames/123.jpg'
      };
      
      // 模拟创建告警后返回的完整记录
      const createdAlert = {
        id: '12345',
        type: 'warning',
        message: '检测到异常行为',
        frameUrl: 'https://example.com/frames/123.jpg',
        timestamp: new Date().toISOString()
      };
      
      // 设置 createAlert 方法的模拟实现
      alertService.createAlert.mockResolvedValue(createdAlert);
      
      // 发送请求并验证响应
      const response = await request(app)
        .post('/api/alerts')
        .send(newAlert)
        .expect('Content-Type', /json/)
        .expect(201);
      
      // 验证响应体包含创建的告警记录
      expect(response.body).toEqual(createdAlert);
      
      // 验证 createAlert 方法被调用，并且传入了正确的参数
      expect(alertService.createAlert).toHaveBeenCalledTimes(1);
      expect(alertService.createAlert).toHaveBeenCalledWith(newAlert);
    });

    it('应该返回 400 状态码，当请求体缺少必要字段时', async () => {
      // 模拟不完整的告警数据
      const incompleteAlert = {
        // 缺少 type 和 message 字段
        frameUrl: 'https://example.com/frames/123.jpg'
      };
      
      // 发送请求并验证响应
      const response = await request(app)
        .post('/api/alerts')
        .send(incompleteAlert)
        .expect('Content-Type', /json/)
        .expect(400);
      
      // 验证响应体包含错误信息
      expect(response.body).toHaveProperty('error');
      
      // 验证 createAlert 方法没有被调用
      expect(alertService.createAlert).not.toHaveBeenCalled();
    });

    it('应该返回 500 状态码，当服务层抛出异常时', async () => {
      // 模拟要创建的告警数据
      const newAlert = {
        type: 'error',
        message: '系统错误',
        frameUrl: 'https://example.com/frames/456.jpg'
      };
      
      // 设置 createAlert 方法抛出异常
      alertService.createAlert.mockRejectedValue(new Error('数据库连接失败'));
      
      // 发送请求并验证响应
      const response = await request(app)
        .post('/api/alerts')
        .send(newAlert)
        .expect('Content-Type', /json/)
        .expect(500);
      
      // 验证响应体包含错误信息
      expect(response.body).toHaveProperty('error');
      
      // 验证 createAlert 方法被调用
      expect(alertService.createAlert).toHaveBeenCalledTimes(1);
    });
  });
}); 