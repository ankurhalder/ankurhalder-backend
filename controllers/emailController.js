/* eslint-disable no-console */
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
const catchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/appError");
const emailAnalyticsService = require("../utils/emailAnalyticsService");

const yourEmail = process.env.EMAIL;
const yourPassword = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: yourEmail,
    pass: yourPassword,
  },
});

const sendEmail = async (
  name,
  recipientEmail,
  subject,
  message,
  attachments,
) => {
  const mailOptions = {
    from: recipientEmail,
    to: yourEmail,
    subject: `Contact Form: ${subject}`,
    html: `
      <p>You have a new message from <strong>${name}</strong> (${recipientEmail}):</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `,
    attachments: attachments.map((file) => ({
      filename: file.originalname,
      content: file.buffer,
    })),
    headers: {
      "X-Custom-Header": "YourCustomValue",
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    await emailAnalyticsService.trackEmail(info.messageId);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new AppError("Error sending email", 500);
  }
};

const handleContactForm = catchAsync(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return next(new AppError("Please fill in all required fields.", 400));
  }

  const sendAt = req.body.sendAt ? new Date(req.body.sendAt) : Date.now();
  if (sendAt > Date.now()) {
    schedule.scheduleJob(sendAt, async () => {
      await sendEmail(name, email, subject, message, req.files || []);
    });
    res.status(200).send("Your message has been scheduled for later.");
  } else {
    const emailResponse = await sendEmail(
      name,
      email,
      subject,
      message,
      req.files || [],
    );
    if (emailResponse.success) {
      res.status(200).send("Your message has been sent successfully.");
    } else {
      return next(new AppError("Error sending email", 500));
    }
  }
});

module.exports = {
  handleContactForm,
};
