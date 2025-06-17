// routes/topikRoutes.js
const express = require('express');
const topikController = require('../controllers/topikController');
const router = express.Router();

// Route untuk menangani GET Daftar Topik
router.get('/daftartopikta', (req, res) => {
  res.render('admin/daftartopikta'); // Tampilkan halaman dari folder admin
});

// Route untuk menangani POST Daftar Topik
router.post('/daftartopikta', topikController.addTopik);

// Route untuk menampilkan Daftar Topik
router.get('/daftartopiktersedia', topikController.getTopikTersedia);

module.exports = router;
