const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Halaman untuk mahasiswa
router.get("/homemahasiswa", auth.isLoggedIn, auth.isMahasiswa, (req, res) => {
  res.render("homemahasiswa", { user: req.session.user });
});

// Halaman untuk dosen
router.get("/homedosen", auth.isLoggedIn, auth.isDosen, (req, res) => {
  res.render("homedosen", { user: req.session.user });
});

// Halaman untuk admin
router.get("/homeadmin", auth.isLoggedIn, auth.isAdmin, (req, res) => {
  res.render("homeadmin", { user: req.session.user });
});

module.exports = router;

