const express = require('express');
const router = express.Router();
const { submitJadwal } = require('../controllers/jadwalController');

// Route untuk menampilkan form jadwal
router.get('/', (req, res) => {
  res.render('admin/jadwal'); // Menampilkan tampilan form admin/jadwal.ejs
});

// Route untuk menangani submit form jadwal
router.post('/submit', submitJadwal); // Mengarah ke controller submitJadwal

module.exports = router;
