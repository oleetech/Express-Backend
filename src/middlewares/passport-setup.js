const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const { getRepository } = require('typeorm');
const User = require('../entities/User'); // Adjust the path as needed

// Import the AppDataSource configuration
const AppDataSource = require('../config/database'); // Adjust the path as needed

const jwtSecret = process.env.JWT_SECRET;

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    
    const existingUser = await userRepository.findOne({ where: { googleId: profile.id } });
    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = userRepository.create({
      googleId: profile.id,
      email: profile.emails[0].value,
      username: profile.displayName,
    });
    await userRepository.save(newUser);
    done(null, newUser);
  } catch (err) {
    done(err, false);
  }
}));

// JWT Strategy
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
}, async (jwtPayload, done) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: jwtPayload.id } });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    done(err, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
