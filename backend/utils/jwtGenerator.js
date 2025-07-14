const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id, role) {
  const payload = {
    user: user_id,
    role: role,
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });
}

module.exports = jwtGenerator;
