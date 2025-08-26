function verifyAdmin(req, res, next) {
  const role = req.headers["x-role"];
  if (role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
}

module.exports = { verifyAdmin };
