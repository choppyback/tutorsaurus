const router = require("express").Router();

// Import Middleware
const authenticate = require("../middleware/authenticate");

// Import Controller
const createBooking = require("../controllers/bookingController");
const tutorBookings = require("../controllers/tutorBookingsController");
const studentBookings = require("../controllers/studentBookingsController");
const cancelBooking = require("../controllers/cancelBookingController");

// Creating booking
router.post("/", authenticate, createBooking);
router.get("/student", authenticate, studentBookings);
router.get("/:id", tutorBookings);
router.patch("/:id/cancel", authenticate, cancelBooking);
//router.delete("/:id", authenticate, deleteBooking);

module.exports = router;
