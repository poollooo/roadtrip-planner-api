const jsonWebToken = require("jsonwebtoken");
const User = require("../models/User.model");

const isAuthenticated = async (req, res, next) => {
  // getting token from header 
  let token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({ message: "No token found!" });
  }
  // decompose the token and extract the user id by decrypting it
  token = token.replace("Bearer ", "");
  const userToken = jsonWebToken.verify(token, process.env.TOKEN_SECRET);

  try {
    // search for the user with the encrypted id in the database
    const user = await User.findById(userToken.user).select("-password");

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
