const express = require('express');
const router = express.Router();
const hasilKonsultasiController = require('../controllers/hasilKonsultasiController'); // Pastikan path-nya benar
const { isLoggedIn, isDosen, isAdmin, isMahasiswa } = require('../middleware/auth');

// Halaman Hasil Konsultasi
router.get('/hasilKonsultasi',isLoggedIn, isMahasiswa,  hasilKonsultasiController.getHasilKonsultasi);

// Generate PDF
router.get('/generatePDF', hasilKonsultasiController.generatePDF);

module.exports = router;
