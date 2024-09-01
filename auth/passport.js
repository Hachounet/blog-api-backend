const { ExtractJwt, Strategy } = require("passport-jwt");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const unprotectedOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  ignoreExpiration: true,
};

passport.use(
  "classic-protected",
  new Strategy(options, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (user) return done(null, user);
      else {
        return done(null, false); // If user not found, will respond with 401 err
      }
    } catch (err) {
      return done(err);
    }
  }),
);

passport.use(
  "unprotected-route",
  new Strategy(unprotectedOptions, async (payload, done) => {
    try {
      const user = payload ? payload.id : null;
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

const authenticateJWT = passport.authenticate("classic-protected", {
  session: false,
});
const optionalAuthenticateJWT = passport.authenticate("unprotected-route", {
  session: false,
});

module.exports = { authenticateJWT, optionalAuthenticateJWT };
