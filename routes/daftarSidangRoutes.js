const express = require('express');
const router = express.Router();
const daftarSidangController = require('../controllers/daftarSidangController');
const auth = require('../middleware/auth');

// Route untuk menampilkan halaman pendaftaran sidang
router.get('/sistemdaftarsidang', auth.isLoggedIn, daftarSidangController.renderDaftarSidang);

// Route untuk menangani form pendaftaran sidang
router.post('/sistemdaftarsidang', auth.isLoggedIn, daftarSidangController.handleDaftarSidang);

// Route untuk membatalkan pendaftaran sidang
router.delete('/sistemdaftarsidang', auth.isLoggedIn, daftarSidangController.handleBatalDaftarSidang);

module.exports = router;