const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Menampilkan halaman roles
router.get('/roles', roleController.getRoles);

// Mengedit role
router.post('/roles/edit/:id', roleController.editRole);

// Menghapus role
router.post('/roles/delete/:email', roleController.deleteRole);

module.exports = router;
