const express = require("express");
const emailController = require("../controllers/emailController");

const router = express.Router();

router.post("/contact", emailController.handleContactForm);

module.exports = router;
