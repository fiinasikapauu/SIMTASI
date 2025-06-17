// middleware/auth.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;

module.exports.isLoggedIn = (req, res, next) => {
  // Cek apakah pengguna sudah login
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect("/signin"); // Jika belum login, arahkan ke halaman login
  }
};

module.exports.isMahasiswa = (req, res, next) => {
  // Cek apakah user memiliki role "MAHASISWA"
  if (req.session.user && req.session.user.role === "MAHASISWA") {
    return next();
  } else {
    return res.redirect("/signin"); // Jika bukan mahasiswa, arahkan ke halaman login
  }
};

module.exports.isDosen = (req, res, next) => {
  // Cek apakah user memiliki role "DOSEN"
  if (req.session.user && req.session.user.role === "DOSEN") {
    return next();
  } else {
    return res.redirect("/signin"); // Jika bukan dosen, arahkan ke halaman login
  }
};

module.exports.isAdmin = (req, res, next) => {
  // Cek apakah user memiliki role "ADMIN"
  if (req.session.user && req.session.user.role === "ADMIN") {
    return next();
  } else {
    return res.redirect("/signin"); // Jika bukan admin, arahkan ke halaman login
  }
};


