const router = require("express").Router();

// Import Middleware
const authenticate = require("../middleware/authenticate");

// Import Controller
const submitReview = require("../controllers/submitReviewController");

// Routes
router.post("/", authenticate, submitReview);

module.exports = router;
