const express = require("express");

const router = express.Router();
const { sendEmail } = require("../controllers/emailController");
const catchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/appError");

// Endpoint to handle contact form submissions
router.post(
  "/contact",
  catchAsync(async (req, res, next) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return next(new AppError("All fields are required", 400));
    }

    const emailResponse = await sendEmail(email, subject, message);

    if (emailResponse.success) {
      res.status(200).send(emailResponse.message);
    } else {
      return next(new AppError("Error sending email", 500));
    }
  }),
);

module.exports = router;
