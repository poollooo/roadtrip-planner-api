module.exports.isAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(400).json({ message: "No user found!" });
  }

  if (req.user.role !== "admin") {
    return res.status(400).json({ message: "You can't access this route" });
  }

  next();
};
