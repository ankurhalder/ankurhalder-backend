const express = require("express");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const emailRouter = require("./routes/emailRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://www.ankurhalder.in",
      "https://ankurhalder.in",
    ],
    methods: "GET,POST,PUT,DELETE,PATCH,UPDATE,HEAD",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    credentials: true,
  }),
);

// @ 1) Global  middlewares

//# Security HTTP headers
app.use(helmet());

//# dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//# Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  // # Try to use JSON is response in future
  message: "Too many requests from this IP, plaese try again in an hour!",
});

app.use("/api", limiter);

//# Body parser, reading data from the body
app.use(
  express.json({
    limit: "15kb",
  }),
);

//# Data sanitization against NOSQL query injection
app.use(mongoSanitize());

//# Data sanitization agaianst XSS
app.use(xss());

//# Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [],
  }),
);

//# Serving static files
app.use(express.static(path.join(__dirname, "public")));

//# Test Middleware
app.use((req, res, next) => {
  // console.log("hello from middleware 😊");
  next();
});

app.get("/", (req, res, next) => {
  try {
    const response = {
      status: "success",
      message: "Welcome to the API!",
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    next(new AppError("An error occurred while processing your request.", 500));
  }
});
//@ 2) Routes

app.use("/api/v1/users", userRouter);
app.use("/api/v1/email", emailRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
