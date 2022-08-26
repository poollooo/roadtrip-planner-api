// // !TODO - still need to check if auth is done via sessions or not
// module.exports = (req, res, next) => {
//   // checks if the user is logged in when trying to access a specific page
//   if (!req.session.user) {
//     return res
//       .status(403)
//       .json({ errorMessage: "You must be logged in to see this page" });
//   }
//   req.user = req.session.user;
//   next();
// };

const jsonWebToken = require("jsonwebtoken");
const User = require("../models/User.model");

const isAuthenticated = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({ message: "No token found!" });
  }
  token = token.replace("Bearer ", "");
  const userToken = jsonWebToken.verify(token, process.env.TOKEN_SECRET);
  console.log(userToken);
  try {
    const user = await User.findOne({ username: userToken.username });
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
