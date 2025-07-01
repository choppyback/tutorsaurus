const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

const signupUser = async (req, res) => {
  try {
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
      availability,
    } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length > 0) {
      return res.status(401).json("User already exists!");
    }

    if (role === "tutor" && !req.file) {
      return res
        .status(400)
        .json({ error: "Profile picture is required for tutors." });
    }

    const profilePicPath = req.file ? `/uploads/${req.file.filename}` : null;

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

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

    const userId = newUser.rows[0].user_id;

    if (role === "tutor") {
      // Insert into tutors table
      await pool.query(`INSERT INTO tutors (user_id, bio) VALUES ($1, $2)`, [
        userId,
        "",
      ]);

      // Insert tutor modules
      const moduleList = modules_taught.split(",").map((m) => m.trim());
      for (const code of moduleList) {
        const result = await pool.query(
          `SELECT module_id FROM modules WHERE code = $1`,
          [code]
        );

        if (result.rows.length === 0) {
          console.warn(`Module not found: ${code}`);
          continue;
        }

        const moduleId = result.rows[0].module_id;
        await pool.query(
          `INSERT INTO tutor_modules (user_id, module_id, hourly_rate)
           VALUES ($1, $2, $3)`,
          [userId, moduleId, Number(hourly_rate)]
        );
      }

      // Insert tutor availability
      const parsedAvailability = availability ? JSON.parse(availability) : {};
      for (const [day, slot] of Object.entries(parsedAvailability)) {
        const { enabled, start, end } = slot;
        if (enabled && start && end) {
          await pool.query(
            `INSERT INTO availability (user_id, day, start_time, end_time)
             VALUES ($1, $2, $3, $4)`,
            [userId, day, start, end]
          );
        }
      }
    }

    const jwtToken = jwtGenerator(userId);
    res.json({ jwtToken });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).send("Server error");
  }
};

module.exports = signupUser;
