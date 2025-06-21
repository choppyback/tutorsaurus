const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorize = require("../middleware/authorize");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const dir = path.join(__dirname, "../uploads");
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// Register route

router.post("/signup", upload.single("profile_pic"), async (req, res) => {
  try {
    // 1. destructure the req.body (name, body, email)
    const {
      name,
      email,
      password,
      role,
      faculty,
      gender,
      year_of_study,
      modules_taught,
      hourly_rate,
    } = req.body;

    // 2. check if user exist (if exist then throw error)
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exist!");
    }

    // For tutors ensure there is profile picture
    if (role === "tutor" && !req.file) {
      return res
        .status(400)
        .json({ error: "Profile picture is required for tutors." });
    }

    const profilePicPath = req.file ? `/uploads/${req.file.filename}` : null;

    // 3. Bcrypt the user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. enter the new user inside our database
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, role, faculty, gender, year_of_study, profile_pic)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        name,
        email,
        bcryptPassword,
        role,
        faculty,
        gender,
        year_of_study,
        profilePicPath,
      ]
    );

    /*
    if (role === "tutor") {
      insertQuery += `, modules_taught, hourly_rate`;
      values.push(modules_taught.split(",").map((mod) => mod.trim()));
      values.push(Number(hourly_rate));
    }
      */

    const userId = newUser.rows[0].user_id;

    // If tutor, insert into tutors table
    if (role === "tutor") {
      // Insert into tutors table
      await pool.query(
        `INSERT INTO tutors (tutor_id, bio) VALUES ($1, $2)`,
        [userId, ""] // empty bio for now
      );

      const moduleList = modules_taught.split(",").map((m) => m.trim());

      for (const code of moduleList) {
        const result = await pool.query(
          `SELECT module_id FROM modules WHERE code = $1`,
          [code]
        );

        if (result.rows.length === 0) {
          console.warn(`Module code not found: ${code}`);
          continue;
        }

        const moduleId = result.rows[0].module_id;

        await pool.query(
          `INSERT INTO tutor_modules (tutor_id, module_id, hourly_rate) VALUES ($1, $2, $3)`,
          [userId, moduleId, Number(hourly_rate)]
        );
      }
    }

    // 5. generating our jwt token
    const jwtToken = jwtGenerator(newUser.rows[0].user_id);

    res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login route
router.post("/login", validInfo, async (req, res) => {
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
    const jwtToken = jwtGenerator(user.rows[0].user_id);
    res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// verify jwt token
router.get("/verify", authorize, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
