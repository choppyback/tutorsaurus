const router = require("express").Router();

// Import Middleware
const authorize = require("../middleware/authorize");

// Import Controller
const createBooking = require("../controllers/bookingController");
const tutorBookings = require("../controllers/tutorBookingsController");
const studentBookings = require("../controllers/studentBookingsController");

// Creating booking
router.post("/", authorize, createBooking);
router.get("/student", authorize, studentBookings);
router.get("/:id", tutorBookings);

module.exports = router;
