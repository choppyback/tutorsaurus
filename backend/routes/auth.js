const router = require("express").Router();

// Import Middleware
const validateLogin = require("../middleware/validateLogin");
const validateSignup = require("../middleware/validateSignup");
const authorize = require("../middleware/authorize");

// Import Controllers
const signupUser = require("../controllers/signupController");
const loginUser = require("../controllers/loginController");

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

// Routes
router.post(
  "/signup",
  upload.single("profile_pic"),
  validateSignup,
  signupUser
);
router.post("/login", validateLogin, loginUser);

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
