const jsonWebToken = require("jsonwebtoken");
const User = require("../models/User.model");

const isAuthenticated = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({ message: "No token found!" });
  }
  token = token.replace("Bearer ", "");
  const userToken = jsonWebToken.verify(token, process.env.TOKEN_SECRET);

  try {
    const user = await User.findById(userToken.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
  // Once everything went well, go to the next middleware
  next();
};

module.exports = isAuthenticated;
