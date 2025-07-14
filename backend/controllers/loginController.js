const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

const loginUser = async (req, res) => {
  try {
    // 1. destructure the req.body
    const { email, password } = req.body;

    // 2. check if user doesn't exist (if not throw error)
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Password or Email is incorrect");
    }

    // 3. check is incoming password is the same as database password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }

    // 4. give them the jwt token
    const jwtToken = jwtGenerator(user.rows[0].user_id, user.rows[0].role);
    res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = loginUser;
