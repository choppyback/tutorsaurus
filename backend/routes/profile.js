const router = require("express").Router();
const pool = require("../db");
const authenticate = require("../middleware/authenticate");
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
router.get("/", authenticate, async (req, res) => {
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
        "SELECT bio FROM tutors WHERE user_id = $1",
        [user_id]
      );

      const moduleRes = await pool.query(
        `SELECT m.code, tm.hourly_rate
         FROM tutor_modules tm
         JOIN modules m ON tm.module_id = m.module_id
         WHERE tm.user_id = $1`,
        [user_id]
      );

      const modules = moduleRes.rows.map((r) => r.code).join(", ");
      const hourly_rate = moduleRes.rows[0]?.hourly_rate || null;

      // Fetch availability
      const availabilityRes = await pool.query(
        `SELECT day, start_time, end_time
         FROM availability
         WHERE user_id = $1
         ORDER BY 
           CASE day
             WHEN 'Mon' THEN 1
             WHEN 'Tue' THEN 2
             WHEN 'Wed' THEN 3
             WHEN 'Thu' THEN 4
             WHEN 'Fri' THEN 5
             WHEN 'Sat' THEN 6
             WHEN 'Sun' THEN 7
           END, start_time`,
        [user_id]
      );

      const availability = availabilityRes.rows.map((row) => ({
        day: row.day,
        start_time: row.start_time,
        end_time: row.end_time,
      }));

      user.bio = tutorRes.rows[0]?.bio || "";
      user.availability = availability;
      user.modules_taught = modules;
      user.hourly_rate = hourly_rate;
    }

    res.json(user);
  } catch (err) {
    console.error("GET profile error:", err.message);
    res.status(500).send("Server error");
  }
});

// GET tutor profile by user ID
router.get("/:id", async (req, res) => {
  try {
    const user_id = req.params.id;

    // 1. Get general user info, ensuring they are a tutor
    const userResult = await pool.query(
      "SELECT * FROM users WHERE user_id = $1 AND role = 'tutor'",
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    const user = userResult.rows[0];

    // 2. Get tutor-specific fields
    const tutorRes = await pool.query(
      "SELECT bio FROM tutors WHERE user_id = $1",
      [user_id]
    );

    const moduleRes = await pool.query(
      `SELECT m.code, tm.hourly_rate
       FROM tutor_modules tm
       JOIN modules m ON tm.module_id = m.module_id
       WHERE tm.user_id = $1`,
      [user_id]
    );

    const modules = moduleRes.rows.map((r) => r.code).join(", ");
    const hourly_rate = moduleRes.rows[0]?.hourly_rate || null;

    // 3. Get availability from availability table
    const availabilityRes = await pool.query(
      `SELECT day, start_time, end_time
       FROM availability
       WHERE user_id = $1
       ORDER BY 
         CASE day
           WHEN 'Mon' THEN 1
           WHEN 'Tue' THEN 2
           WHEN 'Wed' THEN 3
           WHEN 'Thu' THEN 4
           WHEN 'Fri' THEN 5
           WHEN 'Sat' THEN 6
           WHEN 'Sun' THEN 7
         END, start_time`,
      [user_id]
    );

    const availability = availabilityRes.rows.map((row) => ({
      day: row.day,
      start_time: row.start_time,
      end_time: row.end_time,
    }));

    user.bio = tutorRes.rows[0]?.bio || "";
    user.modules_taught = modules;
    user.hourly_rate = hourly_rate;
    user.availability = availability;

    res.json(user);
  } catch (err) {
    console.error("GET /:id tutor profile error:", err.message);
    res.status(500).send("Server error");
  }
});

// PUT
router.put("/", authenticate, upload.single("profile_pic"), async (req, res) => {
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
    } = req.body;

    let availability = {};
    try {
      availability = JSON.parse(req.body.availability || "{}");
    } catch (e) {
      console.error("Invalid availability JSON");
      return res.status(400).json({ message: "Invalid availability format" });
    }

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
        "SELECT * FROM tutors WHERE user_id = $1",
        [user_id]
      );

      if (tutorExists.rows.length === 0) {
        await pool.query("INSERT INTO tutors (user_id, bio) VALUES ($1, $2)", [
          user_id,
          bio || "",
        ]);
      } else {
        await pool.query("UPDATE tutors SET bio = $1 WHERE user_id = $2", [
          bio || "",
          user_id,
        ]);
      }

      // update availability table
      await pool.query("DELETE FROM availability WHERE user_id = $1", [
        user_id,
      ]);

      for (const slot of availability) {
        const { day, start_time, end_time } = slot;

        if (day && start_time && end_time) {
          await pool.query(
            `INSERT INTO availability (user_id, day, start_time, end_time)
       VALUES ($1, $2, $3, $4)`,
            [user_id, day, start_time, end_time]
          );
        }
      }

      if (modules_taught !== undefined) {
        // Clear and re-insert
        await pool.query("DELETE FROM tutor_modules WHERE user_id = $1", [
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
            "INSERT INTO tutor_modules (user_id, module_id, hourly_rate) VALUES ($1, $2, $3)",
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
