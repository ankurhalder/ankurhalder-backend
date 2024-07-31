const express = require("express");

const router = express.Router();
const emailController = require("../controllers/emailController");

// Endpoint to handle contact form submissions
router.post("/contact", emailController.handleContactForm);

module.exports = router;
