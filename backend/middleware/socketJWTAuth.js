const jwt = require("jsonwebtoken");
const log = require("log-beautify");

function socketJWTAuth(socket, next) {
  const token = socket.handshake.auth?.token;

  if (!token) {
    log.warn("No JWT token provided in socket handshake.");
    return next(new Error("Authentication failed: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    socket.user_id = decoded.user;
    socket.role = decoded.role;
    next();
  } catch (err) {
    log.error(`JWT verification failed: ${err.message}`);
    return next(new Error("Authentication failed: Invalid token"));
  }
}

module.exports = socketJWTAuth;
