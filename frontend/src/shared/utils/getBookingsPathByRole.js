export function getBookingsPathByRole(role) {
  if (role === "tutor") {
    return "/tutor/bookings";
  }
  if (role === "student") {
    return "/student/bookings";
  }
}
