// models/emailModel.js
const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  attachments: [
    {
      filename: String,
      contentType: String,
    },
  ],
  headers: {
    type: Map,
    of: String,
  },
});

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
