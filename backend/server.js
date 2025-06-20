const express = require('express');
const cors = require('cors');
const storageRoutes = require('./routes/storage.routes.js');

const app = express();
const port = 5000;

// 中间件
app.use(cors());  // 允许跨域
app.use(express.json());  // 解析JSON请求体

// 路由
app.use('/', storageRoutes);

// 启动服务
app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
});