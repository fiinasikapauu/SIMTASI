const express = require('express');
const router = express.Router();
const riwayatController = require('../controllers/riwayatfeedbacklagiController');
const auth = require("../middleware/auth");

// Rute untuk menampilkan riwayat konsultasi
router.get('/riwayatfeedbacklagi', auth.isLoggedIn, auth.isDosen, riwayatController.getRiwayatKonsultasi);

// Rute untuk mengupdate riwayat konsultasi
router.post('/riwayatfeedbacklagi/update/:id_feedback', auth.isLoggedIn, auth.isDosen, riwayatController.updateRiwayatKonsultasi);


module.exports = router;
