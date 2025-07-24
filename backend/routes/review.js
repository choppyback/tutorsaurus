const router = require("express").Router();

// Import Middleware
const authenticate = require("../middleware/authenticate");

// Import Controller
const submitReview = require("../controllers/submitReviewController");
const viewReview = require("../controllers/viewReviewController");

// Routes
router.post("/", authenticate, submitReview);
router.get("/:bookingId", authenticate, viewReview);

module.exports = router;
