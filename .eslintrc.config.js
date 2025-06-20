// .eslintrc.config.js
module.exports = {
  env: {
    node: true, // 配置文件运行在 Node.js 环境
  },
  rules: {
    // 针对配置文件的特定规则
    'no-undef': 'off', // 允许使用 Node.js 全局变量
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto', // 自动检测行尾符（根据 Git 设置）
      },
    ],
  },
}
