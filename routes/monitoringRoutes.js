const express = require('express');
const router = express.Router();
const bebanDosenController = require('../controllers/bebanDosenController');

// Menampilkan data dosen dan beban bimbingan
router.get('/admin/monitoring-beban', bebanDosenController.getBebanDosen);

// Mengupdate beban bimbingan dosen
router.post('/admin/updateBeban/:id', bebanDosenController.updateBebanDosen);

// Ekspor router agar bisa digunakan di app.js
module.exports = router;
