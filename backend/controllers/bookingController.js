const pool = require("../db");
const { getModuleIdByCode } = require("../utils/moduleConverter");

const bookingController = async (req, res) => {
  const client = await pool.connect();

  try {
    const { tutor_id, module_code, date, start_time } = req.body;
    const student_id = req.user;

    if (!tutor_id || !module_code || !date || !start_time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get module_id
    const module_id = await getModuleIdByCode(module_code);

    // Compute end_time = start_time + 1 hour
    const [hour, min] = start_time.split(":");
    const end = new Date();
    end.setHours(+hour + 1, +min, 0);
    const end_time = end.toTimeString().split(" ")[0].slice(0, 5) + ":00";

    // Begin transaction
    await client.query("BEGIN");

    // Lock active bookings with same tutor/date/start_time
    const conflict = await client.query(
      `SELECT * FROM bookings 
       WHERE tutor_id = $1 AND date = $2 AND start_time = $3 AND status != 'cancelled'
       FOR UPDATE`,
      [tutor_id, date, start_time]
    );

    if (conflict.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        message: "Oops! That slot is already booked.",
      });
    }

    // Insert new booking
    await client.query(
      `INSERT INTO bookings 
       (tutor_id, student_id, module_id, date, start_time, end_time, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
      [tutor_id, student_id, module_id, date, start_time, end_time]
    );

    await client.query("COMMIT");
    res.status(201).json({ message: "Booking confirmed" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Booking error:", err.message);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

module.exports = bookingController;
