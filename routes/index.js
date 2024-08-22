const { Router } = require("express");

const indexRouter = Router();

indexRouter.get("/", getLandingPage);

indexRouter.get("/login", getLoginPage);

indexRouter.post("/login", postLoginPage);

indexRouter.get("/logout", getLogOutPage);

indexRouter.post("/logout", postLogOutPage);

indexRouter.get("/about", getAboutPage);

indexRouter.get("/signup", getSignUpPage);

indexRouter.post("/signup", postSignUpPage);
