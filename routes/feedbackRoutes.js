const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const auth = require("../middleware/auth");


// Rute untuk menampilkan form feedback
router.get('/feedback', auth.isLoggedIn, auth.isDosen, feedbackController.getMahasiswa);

// Rute untuk menyimpan feedback
router.post('/feedback', feedbackController.saveFeedback);

module.exports = router;