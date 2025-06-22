const express = require('express');
const router = express.Router();
const daftarPesertaController = require('../controllers/daftarPesertaController');
const { isLoggedIn, isDosen, isAdmin, isMahasiswa } = require('../middleware/auth');


// Halaman daftar peserta
router.get('/',isLoggedIn,isMahasiswa, daftarPesertaController.getDaftarPeserta);

// Download PDF
router.get('/download', daftarPesertaController.downloadPDF);

module.exports = router;