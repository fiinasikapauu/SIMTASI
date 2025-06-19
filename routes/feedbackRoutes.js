const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Rute untuk menampilkan form feedback
router.get('/feedback', feedbackController.getMahasiswa);

// Rute untuk menyimpan feedback
router.post('/feedback', feedbackController.saveFeedback);

module.exports = router;