const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authorize");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { console } = require("inspector");

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

// GET
router.get("/", authorize, async (req, res) => {
  try {
    const user_id = req.user;

    // 1. Get general user info
    const userResult = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    // 2. If user is a tutor, get tutor-specific fields
    if (user.role === "tutor") {
      const tutorRes = await pool.query(
        "SELECT bio, availability FROM tutors WHERE tutor_id = $1",
        [user_id]
      );

      const moduleRes = await pool.query(
        `SELECT m.code, tm.hourly_rate
         FROM tutor_modules tm
         JOIN modules m ON tm.module_id = m.module_id
         WHERE tm.tutor_id = $1`,
        [user_id]
      );

      const modules = moduleRes.rows.map((r) => r.code).join(", ");
      const hourly_rate = moduleRes.rows[0]?.hourly_rate || null;

      user.bio = tutorRes.rows[0]?.bio || "";
      user.availability = tutorRes.rows[0]?.availability || "";
      user.modules_taught = modules;
      user.hourly_rate = hourly_rate;
    }

    res.json(user);
  } catch (err) {
    console.error("GET profile error:", err.message);
    res.status(500).send("Server error");
  }
});

// PUT
router.put("/", authorize, upload.single("profile_pic"), async (req, res) => {
  try {
    const user_id = req.user;
    const {
      name,
      faculty,
      year_of_study,
      gender,
      email,
      bio,
      modules_taught,
      hourly_rate,
      availability,
    } = req.body;

    const emailCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND user_id != $2",
      [email, user_id]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // USERS table update
    let userQuery = `
      UPDATE users
      SET name = $1, faculty = $2, year_of_study = $3, gender = $4, email = $5`;
    const userValues = [name, faculty, year_of_study, gender, email];

    if (req.file) {
      userQuery += `, profile_pic = $6 WHERE user_id = $7`;
      userValues.push(`/uploads/${req.file.filename}`, user_id);
    } else {
      userQuery += ` WHERE user_id = $6`;
      userValues.push(user_id);
    }

    await pool.query(userQuery, userValues);

    // TUTOR-specific update
    const roleResult = await pool.query(
      "SELECT role FROM users WHERE user_id = $1",
      [user_id]
    );
    const userRole = roleResult.rows[0]?.role;

    if (userRole === "tutor") {
      const tutorExists = await pool.query(
        "SELECT * FROM tutors WHERE tutor_id = $1",
        [user_id]
      );

      if (tutorExists.rows.length === 0) {
        await pool.query(
          "INSERT INTO tutors (tutor_id, bio, availability) VALUES ($1, $2, $3)",
          [user_id, bio || "", availability || ""]
        );
      } else {
        await pool.query(
          "UPDATE tutors SET bio = $1, availability = $2 WHERE tutor_id = $3",
          [bio || "", availability || "", user_id]
        );
      }

      if (modules_taught !== undefined) {
        // Clear and re-insert
        await pool.query("DELETE FROM tutor_modules WHERE tutor_id = $1", [
          user_id,
        ]);

        const moduleCodes = modules_taught
          .split(",")
          .map((code) => code.trim().toUpperCase())
          .filter(Boolean);

        for (const code of moduleCodes) {
          let result = await pool.query(
            "SELECT * FROM modules WHERE code = $1",
            [code]
          );

          if (result.rows.length === 0) {
            result = await pool.query(
              "INSERT INTO modules (code) VALUES ($1) RETURNING module_id",
              [code]
            );
          }

          const module_id = result.rows[0].module_id;

          await pool.query(
            "INSERT INTO tutor_modules (tutor_id, module_id, hourly_rate) VALUES ($1, $2, $3)",
            [user_id, module_id, hourly_rate]
          );
        }
      }
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
