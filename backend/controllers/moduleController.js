const pool = require("../db");

// used to get list of all module codes
const getModules = async (req, res) => {
  try {
    const result = await pool.query("SELECT code FROM modules ORDER BY code");
    const moduleCodes = result.rows.map((row) => row.code);
    res.json(moduleCodes);
  } catch (err) {
    console.error("Error fetching modules:", err.message);
    res.status(500).send("Error fetching modules");
  }
};

module.exports = getModules;
