const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Rute untuk menampilkan semua user dan role-nya
router.get('/', roleController.getRoles);  // Perhatikan penggunaan '/' di sini, bukan '/roles'

// Rute untuk mengedit role user
router.post('/edit/:id', roleController.editRole);

// Rute untuk menghapus user berdasarkan email_user
router.post('/delete/:email', roleController.deleteRole); 

module.exports = router;
