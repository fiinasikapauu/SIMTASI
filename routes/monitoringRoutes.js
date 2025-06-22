const express = require('express');
const router = express.Router();
const bebanDosenController = require('../controllers/bebanDosenController');
const { isLoggedIn, isDosen, isAdmin, isMahasiswa } = require('../middleware/auth');

// Menampilkan data dosen dan beban bimbingan
router.get('/admin/monitoring-beban', isLoggedIn, isAdmin, bebanDosenController.getBebanDosen);

// Mengupdate beban bimbingan dosen
router.post('/admin/updateBeban/:id', bebanDosenController.updateBebanDosen);

//fatih
// Route untuk mengambil data monitoring beban dosen
router.get('/monitoring-beban', isLoggedIn, isAdmin, bebanDosenController.getMonitoringBeban);

// Route untuk memperbarui beban bimbingan dosen
router.post('/monitoring-beban', bebanDosenController.updateBebanBimbingan);


module.exports = router;
