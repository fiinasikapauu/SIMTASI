const express = require('express');
const router = express.Router();
const bebanDosenController = require('../controllers/bebanDosenController');


// Menampilkan data dosen dan beban bimbingan
router.get('/admin/monitoring-beban', bebanDosenController.getBebanDosen);

// Mengupdate beban bimbingan dosen
router.post('/admin/updateBeban/:id', bebanDosenController.updateBebanDosen);

//fatih
// Route untuk mengambil data monitoring beban dosen
router.get('/monitoring-beban', bebanDosenController.getMonitoringBeban);

// Route untuk memperbarui beban bimbingan dosen
router.post('/monitoring-beban', bebanDosenController.updateBebanBimbingan);


module.exports = router;
