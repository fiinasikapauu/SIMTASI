const express = require('express');
const router = express.Router();
const daftarPesertaController = require('../controllers/daftarPesertaController');

// Halaman daftar peserta
router.get('/', daftarPesertaController.getDaftarPeserta);

// Download PDF
router.get('/download', daftarPesertaController.downloadPDF);

module.exports = router;