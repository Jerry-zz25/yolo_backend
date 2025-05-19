// 设置测试环境变量
process.env.NODE_ENV = 'test';

// 设置其他通用环境变量
process.env.PORT = '5000';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URL = 'mock:database:url';

// 这里可以添加全局的测试辅助函数
global.testUtils = {
  // 创建一个模拟用户对象的辅助函数
  createMockUser: (overrides = {}) => ({
    id: 'user123',
    username: 'testuser',
    email: 'test@example.com',
    ...overrides
  }),
  
  // 创建一个模拟告警对象的辅助函数
  createMockAlert: (overrides = {}) => ({
    id: 'alert123',
    type: 'warning',
    message: '测试告警消息',
    frameUrl: 'https://example.com/frames/test.jpg',
    timestamp: new Date('2023-05-19T10:00:00Z').toISOString(),
    ...overrides
  })
};

// 设置全局的Jest超时时间（毫秒）
jest.setTimeout(10000);

// 注意：beforeAll和afterAll不能直接在这里使用
// 它们需要在测试文件中使用

// 如果需要在所有测试开始前执行某些操作，可以考虑：
// 1. 使用一个初始化函数，在每个测试文件的开头调用
// 2. 在jest.config.js中使用globalSetup和globalTeardown选项

// 例如，可以导出一个初始化函数
global.setupTestEnvironment = () => {
  console.log('启动测试环境...');
  // 在这里放置原本在beforeAll中的代码
};

global.cleanupTestEnvironment = () => {
  console.log('清理测试环境...');
  // 在这里放置原本在afterAll中的代码
}; 