const express = require("express");
const { PrismaClient } = require("@prisma/client");
const passport = require("passport");
const path = require("path");

const indexRouter = require("./routes/indexRouter");
const postsRouter = require("./routes/postsRouter");
const dashboardRouter = require("./routes/dashboard");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

require("./db/passport");
app.use(passport.initialize());

app.use((req, res, next) => {
  // Middleware to declare locals

  next();
});

app.use("/", indexRouter);
app.use("/posts", postsRouter);
app.use("/dashboard", dashboardRouter);

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
app.listen(PORT, () => {
  console.log(`Server launched on PORT ${PORT}`);
});
