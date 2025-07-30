const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Admins only" });
  }
  next();
};

module.exports = authorizeAdmin;
