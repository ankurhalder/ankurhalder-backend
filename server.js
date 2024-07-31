/* eslint-disable no-console */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

process.on("uncaughtException", (err) => {
  console.log("!Uncaught Exception 💥 Shutting down");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({
  path: "./config.env",
});

const app = require("./app");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://www.ankurhalder.in",
      "https://ankurhalder.in",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.MONGO_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log("DB Connection Successful!");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down");
  server.close(() => {
    process.exit(1);
  });
});
