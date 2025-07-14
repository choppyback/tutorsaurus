const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.jwtSecret);

    req.user = payload.user;
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(403).json({ message: "Not Authorized" });
  }
};
