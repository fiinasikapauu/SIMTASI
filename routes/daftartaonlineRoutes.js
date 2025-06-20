const express = require('express');
const router = express.Router();
const daftartaonlineController = require('../controllers/daftartaonlineController');
const auth = require("../middleware/auth");


// Route untuk menampilkan halaman pendaftaran topik TA
router.get('/daftartaonline', auth.isLoggedIn,auth.isMahasiswa, daftartaonlineController.getRegistrationPage);

// Route untuk menangani pengiriman pendaftaran topik TA
router.post('/daftartaonline/submit',auth.isLoggedIn,auth.isMahasiswa,daftartaonlineController.submitRegistration);

module.exports = router;
