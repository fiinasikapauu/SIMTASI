const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { isLoggedIn, isDosen, isAdmin, isMahasiswa } = require('../middleware/auth');

// Menampilkan halaman roles
router.get('/roles',isLoggedIn, isAdmin, roleController.getRoles);

// Mengedit role
router.post('/roles/edit/:id', roleController.editRole);

// Menghapus role
router.post('/roles/delete/:email', roleController.deleteRole);

module.exports = router;
