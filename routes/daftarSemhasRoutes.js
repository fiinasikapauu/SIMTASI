const express = require('express');
const router = express.Router();
const daftarSeminarController = require('../controllers/daftarSemhasController');
const auth = require('../middleware/auth');

// Route untuk menampilkan halaman pendaftaran seminar
router.get('/sistemdaftarsemhas', auth.isLoggedIn, daftarSeminarController.renderDaftarSeminar);

// Route untuk menangani form pendaftaran seminar
router.post('/sistemdaftarsemhas', auth.isLoggedIn, daftarSeminarController.handleDaftarSeminar);

// Route untuk membatalkan pendaftaran seminar
router.delete('/sistemdaftarsemhas', auth.isLoggedIn, daftarSeminarController.handleBatalDaftar);

module.exports = router;