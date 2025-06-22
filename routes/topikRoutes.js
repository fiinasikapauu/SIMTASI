// routes/topikRoutes.js
const express = require('express');
const topikController = require('../controllers/topikController');
const router = express.Router();
const monitoringController = require('../controllers/monitoringController');
const approvalController = require('../controllers/approvalController');
const { getFinishedTA } = require('../controllers/galeriController');  // Impor controller
const galeriController = require('../controllers/galeriController');
const validasisemhasController = require('../controllers/validasisemhasController');
const validasisidangController = require('../controllers/validasisidangController');
const app = require('../app');
const { isLoggedIn, isDosen, isAdmin, isMahasiswa } = require('../middleware/auth');

// Route untuk menangani GET Daftar Topik
router.get('/daftartopikta', isLoggedIn, isAdmin, (req, res) => {
  res.render('admin/daftartopikta'); // Tampilkan halaman dari folder admin
});

// Route untuk menangani POST Daftar Topik
router.post('/daftartopikta', topikController.addTopik);

// Route untuk menampilkan Daftar Topik
router.get('/daftartopiktersedia', isLoggedIn, isAdmin, topikController.getTopikTersedia);

// Route untuk menampilkan Daftar Topik
router.get('/topiktatersedia',isLoggedIn, isMahasiswa, topikController.getTopikTATersedia);

// Route untuk menangani DELETE Daftar Topik
router.delete('/daftartopiktersedia/:id_topikta', topikController.deleteTopik);

// Route untuk menangani GET Monitoring Beban Dosen
router.get('/bebandosen', isLoggedIn, isAdmin, monitoringController.getMonitoringData);

// Route untuk mengambil data mahasiswa yang perlu disetujui dosen
router.get('/approvaldospem', isLoggedIn, isDosen, approvalController.getApprovalData);

// Route untuk menerima dan memproses persetujuan dosen
router.post('/approvaldospem', approvalController.updateApprovalStatus);

// Route untuk menampilkan Galeri Judul TA yang Selesai
router.get('/galerijudulTA',isLoggedIn, isAdmin, getFinishedTA);

router.get('/galerijudulTA', isLoggedIn, isAdmin, galeriController.downloadPDF);

router.get('/validasidraftsemhas', isLoggedIn, isAdmin, validasisemhasController.getValidasiDraft);
router.post('/validasidraftsemhas/:id', validasisemhasController.updateStatusDraft);

// Endpoint to get the validasi draft sidang
router.get('/validasidraftsidang', isLoggedIn, isAdmin, validasisidangController.getValidasiDraftSidang);
// Endpoint to update the status of draft sidang
router.post('/validasidraftsidang/:id', validasisidangController.updateStatusDraftSidang);


module.exports = router;
