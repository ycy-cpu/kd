// backend/routes/storage.routes.js
const express = require('express');
const router = express.Router();
const storageController = require('../controllers/storage.controller.js');

// 入库
router.post('/in-storage', storageController.storeItem);

// 出库
router.post('/out-storage', storageController.retrieveItem);

// 获取在库列表（带搜索功能）
router.get('/in-storage', storageController.getInStorageList);

// 获取统计数据
router.get('/statistics', storageController.getStatistics);

module.exports = router;