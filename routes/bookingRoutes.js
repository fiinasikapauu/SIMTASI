const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { isLoggedIn, isDosen, isAdmin, isMahasiswa } = require('../middleware/auth');

// Render halaman booking konsultasi
router.get('/bookingkonsul',isLoggedIn,isMahasiswa, bookingController.renderBookingPage);


// Menangani pengiriman form booking
router.post('/bookingkonsul', bookingController.createBooking);

module.exports = router;

