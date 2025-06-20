const express = require('express');
const router = express.Router();
const storageController = require('../controllers/storage.controller.js');

console.log('storageController:', storageController);

// 入库
router.post('/in-storage', storageController.storeItem);

// 出库接口
router.post('/out-storage', storageController.retrieveItem);

// 获取在库列表（前端应请求此接口）
router.get('/in-storage', storageController.getInStorageList);

module.exports = router;