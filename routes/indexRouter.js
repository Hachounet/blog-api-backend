const { Router } = require("express");
const passport = require("passport");

const {
  getLandingPage,
  getLoginPage,
  postLoginPage,
  getLogOutPage,
  postLogOutPage,
  getAboutPage,
  getSignUpPage,
  postSignUpPage,
  getProfilePage,
} = require("../controllers/indexController");

const authenticateJWT = require("../auth/passport");

const indexRouter = Router();

indexRouter.get("/", getLandingPage);

indexRouter.get("/login", getLoginPage);

indexRouter.post("/login", postLoginPage);

indexRouter.get("/logout", getLogOutPage);

indexRouter.post("/logout", postLogOutPage);

indexRouter.get("/about", getAboutPage);

indexRouter.get("/signup", getSignUpPage);

indexRouter.post("/signup", postSignUpPage);

indexRouter.get("/profile", authenticateJWT, getProfilePage);

module.exports = indexRouter;
