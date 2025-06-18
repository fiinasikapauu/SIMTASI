const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Render halaman booking konsultasi
router.get('/bookingkonsul', bookingController.renderBookingPage);

// Menangani pengiriman form booking
router.post('/bookingkonsul', bookingController.createBooking);

module.exports = router;

