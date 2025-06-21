const express = require('express');
const router = express.Router();
const controller = require('../controllers/daftartaonlineController');
const auth = require('../middleware/auth');

router.get('/daftartaonline',
  auth.isLoggedIn,
  auth.isMahasiswa,
  controller.getRegistrationPage
);

router.post('/daftartaonline/submit',
  auth.isLoggedIn,
  auth.isMahasiswa,
  controller.submitRegistration
);

module.exports = router;
