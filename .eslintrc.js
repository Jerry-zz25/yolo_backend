module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // 缩进使用2个空格
    'indent': ['error', 2],
    // 允许使用console
    'no-console': 'off',
    // 尾部逗号设置
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'never'
    }],
    // 引号使用单引号
    'quotes': ['error', 'single'],
    // 允许函数参数重新赋值
    'no-param-reassign': 'off',
    // import不需要带文件扩展名
    'import/extensions': ['error', 'never', { 'json': 'always' }],
    // 最大行长度放宽到120
    'max-len': ['error', { 'code': 120 }],
    // 驼峰命名可以放宽一些
    'camelcase': ['error', { 'properties': 'never', 'ignoreDestructuring': true }],
    // 允许使用下划线作为变量前缀
    'no-underscore-dangle': 'off',
    // 箭头函数体风格
    'arrow-body-style': ['error', 'as-needed'],
    // 限制链式调用行数
    'newline-per-chained-call': ['error', { 'ignoreChainWithDepth': 3 }],
    // 优先使用解构赋值
    'prefer-destructuring': ['error', { 'object': true, 'array': false }],
    // 换行符使用 LF
    'linebreak-style': ['error', 'unix'],
    // 要求使用全等
    'eqeqeq': ['error', 'always', { 'null': 'ignore' }],
    // 多行注释风格
    'multiline-comment-style': ['error', 'starred-block'],
    // 强制对象属性换行一致性
    'object-curly-newline': ['error', {
      'ObjectExpression': { 'multiline': true, 'consistent': true },
      'ObjectPattern': { 'multiline': true, 'consistent': true },
      'ImportDeclaration': { 'multiline': true, 'consistent': true },
      'ExportDeclaration': { 'multiline': true, 'consistent': true }
    }],
    // 对象大括号内空格
    'object-curly-spacing': ['error', 'always'],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.json']
      }
    }
  }
}; 