const { ExtractJwt, Strategy } = require("passport-jwt");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");

// This optional strategy is not for protected routes. It serve as just retrieving userId for getting liked comments, even if token is expirated.

const prisma = new PrismaClient();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  ignoreExpiration: true,
};

passport.use(
  new Strategy(options, async (payload, done) => {
    try {
      const user = payload ? payload.id : null;
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

const optionalAuthenticateJWT = passport.authenticate("jwt", {
  session: false,
});

module.exports = optionalAuthenticateJWT;
