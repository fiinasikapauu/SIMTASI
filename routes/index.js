const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

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

router.get("/uploadproposalta", (req, res) => {
  res.render("mahasiswa/uploadproposalta", { user: req.session.user });
});

router.get("/uploadlaporankemajuan", (req, res) => {
  res.render("mahasiswa/uploadlaporankemajuan", { user: req.session.user });
});

router.get("/uploadrevisilaporan", (req, res) => {
  res.render("mahasiswa/uploadrevisilaporan", { user: req.session.user });
});

router.get("/uploaddraftsemhas", (req, res) => {
  res.render("mahasiswa/uploaddraftsemhas", { user: req.session.user });
});

router.get("/uploaddraftsidang", (req, res) => {
  res.render("mahasiswa/uploaddraftsidang", { user: req.session.user });
});
module.exports = router;
