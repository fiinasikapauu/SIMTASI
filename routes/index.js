const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const proposalController = require('../controllers/proposalController');
const revisiLaporanController = require('../controllers/revisiLaporanController');
const laporanKemajuanController = require('../controllers/laporanKemajuanController');

// MIDDLEWARE
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/signin');
  }
  next();
};

// HOME PAGES (Dashboard)
router.get("/homemahasiswa", auth.isLoggedIn, auth.isMahasiswa, (req, res) => {
  res.render("mahasiswa/homemahasiswa", { user: req.session.user });
});

router.get("/homedosen", auth.isLoggedIn, auth.isDosen, (req, res) => {
  res.render("dosen/homedosen", { user: req.session.user });
});

router.get("/homeadmin", auth.isLoggedIn, auth.isAdmin, (req, res) => {
  res.render("admin/homeadmin", { user: req.session.user });
});

// PROPOSAL TA ROUTES

// Mahasiswa routes
router.get("/uploadproposalta", requireAuth, proposalController.getProposalPage);
router.get('/proposal', requireAuth, proposalController.getProposalPage);
router.post('/upload', requireAuth, proposalController.uploadProposal);
router.get('/api/proposals', requireAuth, proposalController.getProposalData);
router.get('/download/:id', requireAuth, proposalController.downloadProposal);
router.delete('/proposal/:id', requireAuth, proposalController.deleteProposal);

// Dosen routes
router.get("/proposalta", auth.isLoggedIn, auth.isDosen, proposalController.getAllProposalsForDosen);
router.post("/proposalta/feedback", auth.isLoggedIn, auth.isDosen, proposalController.updateProposalFeedback);
router.get('/proposalta/exportpdf', auth.isLoggedIn, auth.isDosen, proposalController.exportProposalPdf);

// LAPORAN KEMAJUAN ROUTES

// Mahasiswa routes
router.get("/uploadlaporankemajuan", requireAuth, laporanKemajuanController.getLaporanKemajuanPage);
router.post("/uploadlaporankemajuan", requireAuth, laporanKemajuanController.uploadLaporanKemajuan);
router.get("/downloadlaporankemajuan/:id", requireAuth, laporanKemajuanController.downloadLaporanKemajuan);
router.get('/api/laporankemajuan', requireAuth, laporanKemajuanController.getLaporanKemajuanData);
router.delete('/laporankemajuan/:id', requireAuth, laporanKemajuanController.deleteLaporanKemajuan);

// Dosen routes
router.get("/laporankemajuan", auth.isLoggedIn, auth.isDosen, laporanKemajuanController.getAllLaporanKemajuanForDosen);
router.post("/laporankemajuan/feedback", auth.isLoggedIn, auth.isDosen, laporanKemajuanController.updateLaporanKemajuanFeedback);
router.get('/laporankemajuan/exportpdf', auth.isLoggedIn, auth.isDosen, laporanKemajuanController.exportLaporanKemajuanPdf);

// REVISI LAPORAN ROUTES

// Mahasiswa routes
router.get("/uploadrevisilaporan", requireAuth, revisiLaporanController.getRevisiPage);
router.post('/uploadrevisilaporan', requireAuth, revisiLaporanController.uploadRevisi);
router.get('/downloadrevisi/:id', requireAuth, revisiLaporanController.downloadRevisi);
router.get('/api/revisilaporan', requireAuth, revisiLaporanController.getRevisiLaporanData);
router.get('/api/proposals', requireAuth, revisiLaporanController.getProposalData);
router.delete('/deleterevisilaporan/:id', requireAuth, revisiLaporanController.deleteRevisiLaporan);

// Dosen routes
router.get("/revisilaporan", auth.isLoggedIn, auth.isDosen, revisiLaporanController.getAllRevisiForDosen);
router.post("/revisilaporan/feedback", auth.isLoggedIn, auth.isDosen, revisiLaporanController.updateRevisiFeedback);
router.get('/revisilaporan/exportpdf', auth.isLoggedIn, auth.isDosen, revisiLaporanController.exportRevisiLaporanPdf);

module.exports = router;
