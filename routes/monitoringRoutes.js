// routes/monitoringRoutes.js
const express = require('express');
const router = express.Router();
const bebanDosenController = require('../controllers/bebanDosenController');
//fatih
// Route untuk mengambil data monitoring beban dosen
router.get('/monitoring-beban-dosen', bebanDosenController.getMonitoringBeban);

// Route untuk memperbarui beban bimbingan dosen
router.post('/update-bean-bimbingan', bebanDosenController.updateBebanBimbingan);

module.exports = router;
