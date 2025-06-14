const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Render signup form
router.get("/signup", (req, res) => res.render("signup"));
// Handle user registration
router.post("/signup", authController.register);

// Render signin form
router.get("/signin", (req, res) => res.render("signin"));
// Handle user login
router.post("/signin", authController.login);

module.exports = router;
