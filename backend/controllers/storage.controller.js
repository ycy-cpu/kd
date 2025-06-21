//storage.controller.js
const pool = require('../models/express.model.js');

// 入库
exports.storeItem = async (req, res) => {
  try {
    const { name, recipient, phone, category } = req.body;
    
    // 查找可用货架（简化版，实际需根据类别查找）
    const [rows] = await pool.execute(
      'SELECT shelf_id, row_num FROM shelf_availability WHERE available > 0 LIMIT 1'
    );
    
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: '没有可用货位' });
    }
    
    const { shelf_id, row_num } = rows[0];
    const in_time = new Date();
    
    // 插入到在库表
    await pool.execute(
      'INSERT INTO in_storage (name, recipient, phone, category, shelf_id, row_num, in_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, recipient, phone, category, shelf_id, row_num, in_time]
    );
    
    // 更新货架可用数量
    await pool.execute(
      'UPDATE shelf_availability SET available = available - 1 WHERE shelf_id = ? AND row_num = ?',
      [shelf_id, row_num]
    );
    
    res.json({ success: true, message: '入库成功', shelf_id, row_num });
  } catch (error) {
    console.error('入库失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 出库
exports.retrieveItem = async (req, res) => {
  try {
    const { name, recipient, phone } = req.body;
    
    // 查询物品是否存在
    const [rows] = await pool.execute(
      'SELECT * FROM in_storage WHERE name = ? AND recipient = ? AND phone = ?',
      [name, recipient, phone]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '物品不存在' });
    }
    
    const item = rows[0];
    const out_time = new Date();
    
    // 开始事务
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // 插入到出库表
      await connection.execute(
        'INSERT INTO out_storage (name, recipient, phone, category, shelf_id, row_num, in_time, out_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [item.name, item.recipient, item.phone, item.category, item.shelf_id, item.row_num, item.in_time, out_time]
      );
      
      // 从在库表删除
      await connection.execute(
        'DELETE FROM in_storage WHERE name = ? AND recipient = ? AND phone = ?',
        [name, recipient, phone]
      );
      
      // 更新货架可用数量
      await connection.execute(
        'UPDATE shelf_availability SET available = available + 1 WHERE shelf_id = ? AND row_num = ?',
        [item.shelf_id, item.row_num]
      );
      
      await connection.commit();
      res.json({ success: true, message: '出库成功' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('出库失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取在库列表（修复后的代码）
exports.getInStorageList = async (req, res) => {
  try {
    console.log('查询参数:', req.query); // 调试日志
    
    // 构建SQL查询条件和参数
    let sql = 'SELECT * FROM in_storage';
    const conditions = [];
    const values = [];
    
    if (req.query.name) {
      conditions.push('name LIKE ?');
      values.push(`%${req.query.name}%`);
    }
    
    if (req.query.recipient) {
      conditions.push('recipient LIKE ?');
      values.push(`%${req.query.recipient}%`);
    }
    
    if (req.query.phone) {
      conditions.push('phone LIKE ?');
      values.push(`%${req.query.phone}%`);
    }
    
    // 添加WHERE子句（如果有条件）
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    console.log('执行SQL:', sql, values); // 调试日志
    
    // 执行查询
    const [inventory] = await pool.execute(sql, values);
        // 确保返回的是数组，并且每个项都有必要的字段
    const formattedData = inventory.map(item => ({
      id: item.id,
      name: item.name,
      recipient: item.recipient,
      phone: item.phone,
      category: item.category,
      shelf_id: item.shelf_id,
      row_num: item.row_num,
      in_time: item.in_time ? item.in_time.toString() : new Date().toString()
    }));
    
    console.log('返回数据:', formattedData);
    res.json(formattedData);

  } catch (err) {
    console.error('获取库存列表失败:', err);
    res.status(500).json({ message: '获取库存列表失败' });
  }
};

// 获取统计数据
exports.getStatistics = async (req, res) => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // 计算总包裹数
    const [totalResult] = await pool.execute(
      'SELECT COUNT(*) AS totalPackages FROM in_storage'
    );
    const totalPackages = totalResult[0].totalPackages || 0;
    
    // 计算今日入库（假设in_time是日期时间字段）
    const [todayInResult] = await pool.execute(
      'SELECT COUNT(*) AS todayIn FROM in_storage WHERE DATE(in_time) = ?',
      [todayStr]
    );
    const todayIn = todayInResult[0].todayIn || 0;
    
    // 计算今日出库（假设out_time是日期时间字段，且数据在out_storage表中）
    const [todayOutResult] = await pool.execute(
      'SELECT COUNT(*) AS todayOut FROM out_storage WHERE DATE(out_time) = ?',
      [todayStr]
    );
    const todayOut = todayOutResult[0].todayOut || 0;
    
    // 计算超期包裹（超过3天）
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - 3);
    const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0];
    
    const [overdueResult] = await pool.execute(
      'SELECT COUNT(*) AS overdue FROM in_storage WHERE DATE(in_time) < ?',
      [threeDaysAgoStr]
    );
    const overdue = overdueResult[0].overdue || 0;
    
    res.json({
      totalPackages,
      todayIn,
      todayOut,
      overdue
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({ message: '获取统计数据失败' });
  }
};