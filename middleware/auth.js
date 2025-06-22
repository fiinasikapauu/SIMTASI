// middleware/auth.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware Cek Login
const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/signin');
};

// Middleware Role Mahasiswa
const isMahasiswa = (req, res, next) => {
  if (req.session?.user?.role === 'MAHASISWA') {
    return next();
  }
  req.session.destroy(() => res.redirect('/signin'));
};

// Middleware Role Dosen
const isDosen = (req, res, next) => {
  if (req.session?.user?.role === 'DOSEN') {
    return next();
  }
  req.session.destroy(() => res.redirect('/signin'));
};

// Middleware Role Admin
const isAdmin = (req, res, next) => {
  if (req.session?.user?.role === 'ADMIN') {
    return next();
  }
  req.session.destroy(() => res.redirect('/signin'));
};

// Ekspor semua fungsi dan prisma
module.exports = {
  prisma,
  isLoggedIn,
  isMahasiswa,
  isDosen,
  isAdmin
};
