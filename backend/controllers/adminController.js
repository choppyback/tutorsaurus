const pool = require("../db");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT user_id, name, email, role, gender, year_of_study, faculty FROM users"
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT user_id, name, email, role, gender, year_of_study, faculty FROM users WHERE user_id = $1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    //unsure abt this part
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, gender, year_of_study, faculty } =
      req.body;

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const safeYear = year_of_study === "" ? null : year_of_study;

    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password, role, gender, year_of_study, faculty) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id, name, email, role",
      [name, email, bcryptPassword, role, gender, safeYear, faculty]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, gender, year_of_study, faculty } = req.body;

    const { rows } = await pool.query(
      "UPDATE users SET name = $1, email = $2, role = $3, gender = $4, year_of_study = $5, faculty = $6 WHERE user_id = $7 RETURNING user_id, name, email, role",
      [name, email, role, gender, year_of_study, faculty, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query(
      "DELETE FROM users WHERE user_id = $1",
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
