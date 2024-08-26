const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
// const passport = require("passport");
const path = require("path");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const https = require("https");

const indexRouter = require("./routes/indexRouter");
const postsRouter = require("./routes/postsRouter");
const dashboardRouter = require("./routes/dashboardRouter");

const app = express();

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH || "key.pem"),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH || "cert.pem"),
};

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS || "*",
  methods: "GET, HEAD, PUT, PATCH, POST,DELETE",
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

require("./auth/passport");
const passport = require("passport");
app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/posts", postsRouter);
// app.use("/dashboard", dashboardRouter);

// Err handling
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.log("Errors details", {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      body: req.body,
      query: req.query,
    });
    res.status(err.status || 500).json({
      error: { message: err.message },
    });
  } else {
    res.status(err.status || 500).send({
      error: {
        message: err.message,
      },
    });
  }
});

const PORT = process.env.PORT || 3000;
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
