const express = require('express');
const router = express.Router();
const hasilKonsultasiController = require('../controllers/hasilKonsultasiController'); // Pastikan path-nya benar

// Halaman Hasil Konsultasi
router.get('/hasilKonsultasi', hasilKonsultasiController.getHasilKonsultasi);

// Generate PDF
router.get('/generatePDF', hasilKonsultasiController.generatePDF);

module.exports = router;
