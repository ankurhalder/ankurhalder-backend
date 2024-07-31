/* eslint-disable no-console */
const nodemailer = require("nodemailer");
const catchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/appError");

const yourEmail = process.env.EMAIL;
const yourPassword = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: yourEmail,
    pass: yourPassword,
  },
});

const sendEmail = catchAsync(async (recipientEmail, subject, message) => {
  const mailOptions = {
    from: recipientEmail,
    to: yourEmail,
    subject: subject,
    text: `From: ${recipientEmail}\n\n${message}`, // Include sender's email in the message body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new AppError("Error sending email", 500);
  }
});

module.exports = {
  sendEmail,
};
