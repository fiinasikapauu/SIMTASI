const express = require('express');
const topikController = require('../controllers/topikController'); // Pastikan jalur relatifnya benar
const router = express.Router();

// Rute untuk menampilkan halaman Daftar Topik TA
router.get('/daftartopikta', (req, res) => {
  res.render('daftartopikta'); // Render daftar-topik.ejs
});

// Rute untuk meng-handle submit data dari form
router.post('/daftartopikta', topikController.addTopik);

module.exports = router;
