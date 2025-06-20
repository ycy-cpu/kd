const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config.js');

// 创建数据库连接池
const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
});

// 测试连接
pool.getConnection()
  .then(connection => {
    console.log('数据库连接成功');
    connection.release();
  })
  .catch(err => {
    console.error('数据库连接失败:', err);
  });

module.exports = pool;