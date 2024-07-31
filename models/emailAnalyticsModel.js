const mongoose = require("mongoose");

const emailAnalyticsSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
  },
  trackingUrl: {
    type: String,
  },
  opened: {
    type: Boolean,
    default: false,
  },
  // Additional fields as needed
});

const EmailAnalytics = mongoose.model("EmailAnalytics", emailAnalyticsSchema);

module.exports = EmailAnalytics;
