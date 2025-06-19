const express = require('express');
const router = express.Router();
const seminarController = require('../controllers/seminarController');

// Route untuk halaman pendaftaran seminar
router.get('/sistemdaftarsemhas', seminarController.renderDaftarSeminar);

// Route untuk menangani form pendaftaran seminar
router.post('/sistemdaftarsemhas');

module.exports = router;