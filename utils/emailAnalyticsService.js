const EmailAnalytics = require("../models/emailAnalyticsModel");

const trackEmail = async (messageId) => {
  // Logic to track email delivery, open rates, etc.
  const emailAnalytics = new EmailAnalytics({ messageId });
  await emailAnalytics.save();
};

module.exports = {
  trackEmail,
};
