// routes/topikRoutes.js
const express = require('express');
const topikController = require('../controllers/topikController');
const router = express.Router();
const monitoringController = require('../controllers/monitoringController');
const approvalController = require('../controllers/approvalController');

// Route untuk menangani GET Daftar Topik
router.get('/daftartopikta', (req, res) => {
  res.render('admin/daftartopikta'); // Tampilkan halaman dari folder admin
});

// Route untuk menangani POST Daftar Topik
router.post('/daftartopikta', topikController.addTopik);

// Route untuk menampilkan Daftar Topik
router.get('/daftartopiktersedia', topikController.getTopikTersedia);

// Route untuk menampilkan Daftar Topik
router.get('/topiktatersedia', topikController.getTopikTATersedia);

// Route untuk menangani DELETE Daftar Topik
router.delete('/daftartopiktersedia/:id_topikta', topikController.deleteTopik);

// Route untuk menangani GET Monitoring Beban Dosen
router.get('/bebandosen', monitoringController.getMonitoringData);

// Route untuk mengambil data mahasiswa yang perlu disetujui dosen
router.get('/approvaldospem', approvalController.getApprovalData);

// Route untuk menerima dan memproses persetujuan dosen
router.post('/approvaldospem', approvalController.updateApprovalStatus);

module.exports = router;
