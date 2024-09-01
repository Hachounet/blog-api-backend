const passport = require("passport");

function customAuthenticateJWT(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next();
    }
    if (!user) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  })(req, res, next);
}

module.exports = customAuthenticateJWT;
