module.exports.isValid = async (req, res, next) => {
  if (!req.user) {
    return res.status(400).json({ message: "No user found!" });
  }

  if (!req.user.isValid) {
    return res
      .status(400)
      .json({ message: "You need to have a valid email to continue" });
  }

  next();
};
