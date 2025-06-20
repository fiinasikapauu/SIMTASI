const express = require('express');
const router = express.Router();
const kalenderAdminController = require('../controllers/kalenderAdminController');

// Endpoint untuk menyimpan tanggal sidang
router.post('/save', kalenderAdminController.saveSidangDate);

// Endpoint untuk menghapus tanggal sidang
router.post('/clear', kalenderAdminController.clearSidangDate);

module.exports = router;