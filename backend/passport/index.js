const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const db = require("../models");
const helper = require("../utils/helper");

const User = db.users;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  "user",
  new JWTStrategy(opts, async (payload, done) => {
    try {
      // payload must contain id
      if (!payload.id) return done(null, false);

      const user = await User.findOne({
        attributes: ["id", "email"], // FIXED: removed invalid columns
        where: { id: payload.id },
      });

      if (!user) return done(null, false);

      return done(null, user.dataValues);
    } catch (error) {
      console.log(error);
      return done(null, false);
    }
  })
);

module.exports = {
  initialize: () => passport.initialize(),

  authenticateUser: (req, res, next) => {
    passport.authenticate("user", { session: false }, (err, user, info) => {
      if (err) {
        return helper.error(res, "Something went wrong", err, 401);
      }

      if (info && info.name === "JsonWebTokenError") {
        return helper.error(res, "Invalid Token", {}, 401);
      }

      if (!user) {
        return helper.error(res, "Invalid Token", {}, 401);
      }

      req.user = user;
      next();
    })(req, res, next);
  },
};
