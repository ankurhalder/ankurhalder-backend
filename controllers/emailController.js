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

const sendEmail = async (name, recipientEmail, subject, message) => {
  const mailOptions = {
    from: recipientEmail,
    to: yourEmail,
    subject: `Contact Form: ${subject}`,
    text: `
      You have a new message from ${name} (${recipientEmail}):

      Subject: ${subject}

      Message:
      ${message}
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new AppError("Error sending email", 500);
  }
};

const handleContactForm = catchAsync(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return next(new AppError("All fields are required", 400));
  }

  const emailResponse = await sendEmail(name, email, subject, message);

  if (emailResponse.success) {
    res.status(200).send(emailResponse.message);
  } else {
    return next(new AppError("Error sending email", 500));
  }
});

module.exports = {
  handleContactForm,
};
