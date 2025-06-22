const express = require('express');
const router = express.Router();
const kalenderMahasiswaController = require('../controllers/kalenderMahasiswaController');
const { isLoggedIn, isDosen, isAdmin, isMahasiswa } = require('../middleware/auth');

// Route untuk menampilkan kalender sidang mahasiswa
router.get('/', isLoggedIn , isMahasiswa, kalenderMahasiswaController.getKalenderPage);

module.exports = router;