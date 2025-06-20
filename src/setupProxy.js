const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000', // 后端API地址
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    }),
  )
}
