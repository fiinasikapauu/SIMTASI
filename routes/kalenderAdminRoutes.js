const express = require('express');
const router = express.Router();
const kalenderAdminController = require('../controllers/kalenderAdminController');
const auth = require('../middleware/auth');

// Route untuk menampilkan halaman kalender sidang
router.get('/', auth.isLoggedIn, auth.isAdmin, kalenderAdminController.getKalenderSidangPage);

// Endpoint untuk menyimpan tanggal sidang
router.post('/save', auth.isLoggedIn, auth.isAdmin, kalenderAdminController.saveSidangDate);

// Endpoint untuk menghapus tanggal sidang
router.post('/clear', auth.isLoggedIn, auth.isAdmin, kalenderAdminController.clearSidangDate);

module.exports = router;