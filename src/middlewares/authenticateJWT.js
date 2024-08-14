// src/middlewares/authenticateJWT.js
const passport = require('passport');

const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Authentication failed', error: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user; // Attach the user to the request object
    next();
  })(req, res, next);
};

module.exports = authenticateJWT;
