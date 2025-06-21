const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const proposalController = require('../controllers/proposalController');
const revisiLaporanController = require('../controllers/revisiLaporanController');
const laporanKemajuanController = require('../controllers/laporanKemajuanController');

// Middleware untuk cek autentikasi
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/signin');
  }
  next();
};

// Halaman untuk mahasiswa
router.get("/homemahasiswa", auth.isLoggedIn, auth.isMahasiswa, (req, res) => {
  res.render("mahasiswa/homemahasiswa", { user: req.session.user });
});

// Halaman untuk dosen
router.get("/homedosen", auth.isLoggedIn, auth.isDosen, (req, res) => {
  res.render("dosen/homedosen", { user: req.session.user });
});

// Halaman untuk admin
router.get("/homeadmin", auth.isLoggedIn, auth.isAdmin, (req, res) => {
  res.render("admin/homeadmin", { user: req.session.user });
});

router.get("/uploadproposalta", requireAuth, proposalController.getProposalPage);

// Tampilkan semua proposal ke dosen
router.get("/proposalta", auth.isLoggedIn, auth.isDosen, proposalController.getAllProposalsForDosen);
router.post("/proposalta/feedback", auth.isLoggedIn, auth.isDosen, proposalController.updateProposalFeedback);

router.get("/uploadlaporankemajuan", requireAuth, laporanKemajuanController.getLaporanKemajuanPage);
router.post("/uploadlaporankemajuan", requireAuth, laporanKemajuanController.uploadLaporanKemajuan);
router.get("/downloadlaporankemajuan/:id", requireAuth, laporanKemajuanController.downloadLaporanKemajuan);
router.get("/laporankemajuan", auth.isLoggedIn, auth.isDosen, laporanKemajuanController.getAllLaporanKemajuanForDosen);
router.post("/laporankemajuan/feedback", auth.isLoggedIn, auth.isDosen, laporanKemajuanController.updateLaporanKemajuanFeedback);

router.get("/uploadrevisilaporan", requireAuth, revisiLaporanController.getRevisiPage);

router.get("/revisilaporan", auth.isLoggedIn, auth.isDosen, revisiLaporanController.getAllRevisiForDosen);
router.post("/revisilaporan/feedback", auth.isLoggedIn, auth.isDosen, revisiLaporanController.updateRevisiFeedback);


// Route untuk menampilkan halaman proposal
router.get('/proposal', requireAuth, proposalController.getProposalPage);

// Route untuk upload proposal
router.post('/upload', requireAuth, proposalController.uploadProposal);

// Route untuk mengambil data proposal (AJAX)
router.get('/api/proposals', requireAuth, proposalController.getProposalData);

// Route untuk download file proposal
router.get('/download/:id', requireAuth, proposalController.downloadProposal);

router.post('/uploadrevisilaporan', requireAuth, revisiLaporanController.uploadRevisi);

router.get('/downloadrevisi/:id', requireAuth, revisiLaporanController.downloadRevisi);

// Route untuk menghapus proposal
router.delete('/proposal/:id', requireAuth, proposalController.deleteProposal);

// Route untuk menghapus laporan kemajuan
router.delete('/laporankemajuan/:id', requireAuth, laporanKemajuanController.deleteLaporanKemajuan);

// Route untuk menghapus revisi laporan
router.delete('/deleterevisilaporan/:id', requireAuth, revisiLaporanController.deleteRevisiLaporan);

// Route untuk export PDF daftar proposal mahasiswa
router.get('/proposalta/exportpdf', auth.isLoggedIn, auth.isDosen, proposalController.exportProposalPdf);

// Route untuk export PDF daftar laporan kemajuan mahasiswa
router.get('/laporankemajuan/exportpdf', auth.isLoggedIn, auth.isDosen, laporanKemajuanController.exportLaporanKemajuanPdf);

// Route untuk export PDF daftar revisi laporan mahasiswa
router.get('/revisilaporan/exportpdf', auth.isLoggedIn, auth.isDosen, revisiLaporanController.exportRevisiLaporanPdf);

module.exports = router;
