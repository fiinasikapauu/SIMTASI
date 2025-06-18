const express = require('express');
const router = express.Router();
const { getPemberianNilai, submitNilai } = require('../controllers/sidangController');

// Menampilkan halaman pemberian nilai
router.get('/pemberian-nilai', getPemberianNilai);

// Menangani pengiriman nilai
router.post('/submit-nilai', submitNilai);

module.exports = router;
