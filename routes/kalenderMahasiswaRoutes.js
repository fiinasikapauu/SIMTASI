const express = require('express');
const router = express.Router();
const kalenderMahasiswaController = require('../controllers/kalenderMahasiswaController');

// Route untuk menampilkan kalender sidang mahasiswa
router.get('/', kalenderMahasiswaController.getKalenderPage);

module.exports = router;