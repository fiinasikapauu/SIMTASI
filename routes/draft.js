const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const draftSemhasController = require("../controllers/draftSemhasController");
const draftSidangController = require("../controllers/draftSidangController");

// Middleware untuk cek autentikasi
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/signin');
  }
  next();
};

// Rute untuk Draft Seminar Hasil
router.get("/uploaddraftsemhas", requireAuth, draftSemhasController.getDraftSemhasPage);
router.post("/uploaddraftsemhas", requireAuth, draftSemhasController.upload.single('draftSemhasFile'), draftSemhasController.uploadDraftSemhas);
router.delete("/uploaddraftsemhas/:id", requireAuth, draftSemhasController.deleteDraftSemhas);

// Rute untuk Draft Sidang 
router.get("/uploaddraftsidang", requireAuth, draftSidangController.getDraftSidangPage);
router.post("/uploaddraftsidang", requireAuth, draftSidangController.upload.single('draftSidangFile'), draftSidangController.uploadDraftSidang);
router.delete("/uploaddraftsidang/:id", requireAuth, draftSidangController.deleteDraftSidang);

module.exports = router;
