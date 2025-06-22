const express = require("express");
const router  = express.Router();
const { isLoggedIn, isDosen } = require("../middleware/auth");
const draftCtrl = require("../controllers/draftsSidangController");

// daftar draft
router.get("/",       isLoggedIn, isDosen, draftCtrl.list);
// open pdf
router.get("/view/:id", isLoggedIn, isDosen, draftCtrl.viewPdf);

module.exports = router;
