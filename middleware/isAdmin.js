module.exports.isAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(400).json({ message: "No user found!" });
  }

  if (req.user.role !== "admin") {
    console.log("You are not admin");
    return res.status(400).json({ message: "You can't acess this route" });
  }
  console.log("You are admin");
  next();
};
