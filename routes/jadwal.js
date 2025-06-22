const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../middleware/auth");
const jadwalController = require("../controllers/jadwalController");
const auth = require('../middleware/auth');


router.get("/", isLoggedIn, isAdmin, jadwalController.form);
router.post("/", isLoggedIn, isAdmin, jadwalController.create);

module.exports = router;
