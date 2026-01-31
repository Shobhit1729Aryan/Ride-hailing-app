const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

module.exports.authUser = async (req, res, next) => {
  console.log("🔁 Auth middleware hit:", req.method, req.originalUrl);

  const token =
    req.cookies?.token || // ✅ fixed: req.cookies instead of req.cookie
    req.headers.authorization?.split(' ')[1] ||
    req.body.token ||
    req.query.token ||
    null; // get token from cookie, header, body, query or null if not found

console.log("🔵 Incoming Authorization Header:", req.headers.authorization);
  console.log("🔵 Cookie Token:", req.cookies?.token);
  console.log("🔵 Body Token:", req.body?.token);
  console.log("🔵 Query Token:", req.query?.token);
  console.log("🔵 Final Token Being Used:", token);


  if (!token) return res.status(401).json({ error: 'Unauthorized' });
console.log("🪪 Received User Token:", token);
  // once logout but sometimes localhost saves the cookie and token to prevent it
  const isBlacklisted = await blacklistTokenModel.findOne({ token: token });
  if (isBlacklisted) return res.status(401).json({ error: 'Unauthorized' });

  // ONCE TOKEN FOUND START DECRYPTING
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token

    console.log("🟢 Decoded Token:", decoded);

   const user = await userModel.findById(decoded.id || decoded._id);
; // find user by id
console.log("🟣 User Found in DB:", user);
    req.user = user; // if user found set user to req.user
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  console.log("🔁 Auth middleware hit:", req.method, req.originalUrl);

  const token =
    req.cookies?.token ||
    req.headers.authorization?.split(' ')[1] ||
    req.body.token ||
    req.query.token ||
    null;

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Log only once per request
    if (!req.logged) {
      console.log("🟢 Decoded Token:", decoded);
      req.logged = true; // Prevent repeated logs
    }

    const captain = await captainModel.findById(decoded.id || decoded._id);
    if (!captain) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.captain = captain;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
