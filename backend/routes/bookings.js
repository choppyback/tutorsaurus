const router = require("express").Router();

// Import Middleware
const authenticate = require("../middleware/authenticate");

// Import Controller
const createBooking = require("../controllers/bookingController");
const getTutorBookedTimes = require("../controllers/getTutorBookedTimes");
const studentBookings = require("../controllers/studentBookingsController");
const tutorBookings = require("../controllers/tutorBookingsController");
const cancelBooking = require("../controllers/cancelBookingController");
const confirmBooking = require("../controllers/confirmBookingController");

// Routes
router.post("/", authenticate, createBooking);
router.get("/student", authenticate, studentBookings);
router.get("/tutor", authenticate, tutorBookings);
router.get("/:id", getTutorBookedTimes);
router.patch("/:id/cancel", authenticate, cancelBooking);
router.patch("/:id/confirm", authenticate, confirmBooking);
//router.delete("/:id", authenticate, deleteBooking);

module.exports = router;
