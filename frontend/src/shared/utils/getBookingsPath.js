import { getRoleFromToken } from "./getRoleFromToken";
import { getBookingsPathByRole } from "./getBookingsPathByRole";

export function getBookingsPath() {
  const role = getRoleFromToken();
  const bookingsPath = getBookingsPathByRole(role);
  return bookingsPath;
}
