const { optionalAuthenticateJWT } = require("./passport");

function customAuthenticateJWT(req, res, next) {
  optionalAuthenticateJWT(req, res, (err, user) => {
    if (err) {
      return next(err);
    }
    req.user = user || null; // Assign user or null if not found
    next();
  });
}

module.exports = customAuthenticateJWT;
