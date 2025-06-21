const express  = require("express");
const router   = express.Router();
const { isLoggedIn, isDosen } = require("../middleware/auth");
const ctrl = require("../controllers/pemberianNilaiController");

/* list & update */
router.get("/",            isLoggedIn, isDosen, ctrl.list);
router.post("/:id",        isLoggedIn, isDosen, ctrl.update);

module.exports = router;
