const express = require('express');
const router = express.Router();
const riwayatController = require('../controllers/riwayatfeedbackdosenController');
const auth = require("../middleware/auth");

// Rute untuk menampilkan riwayat konsultasi
router.get('/riwayatfeedbackdosen', auth.isLoggedIn, auth.isAdmin, riwayatController.getRiwayatKonsultasi);

// Rute untuk menghapus riwayat konsultasi
router.get('/riwayatfeedbackdosen/delete/:id_feedback', riwayatController.deleteRiwayatKonsultasi); // Ganti menjadi GET

module.exports = router;
