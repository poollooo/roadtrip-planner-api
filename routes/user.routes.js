const router = require("express").Router();
const User = require("../models/User.model");
const isAuthenticated = require("../middleware/isAuthenticated");
const { isValid } = require("../middleware/isValid");
const { isAdmin } = require("../middleware/isAdmin");

/* GET home page */
router.get("/", async (req, res, next) => {
  const findAll = await User.find().select("-password");
  res.json({ findAll });
});

// Get one specific User by its userId

router.get("/:userId", isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userFound = await User.findById(userId);

    if (!userFound) {
      return res.status(404).json("No user found");
    }

    const userFoundById = await User.findById(userId);

    res.status(200).json(userFoundById);
  } catch (error) {
    next(error);
  }
});

router.patch("/:username", isAuthenticated, async (req, res, next) => {
  const updatedValue = {};
  if (req.user.username !== req.params.username) {
    return res.status(400).json({ message: "You can't access this route" });
  }
  if (!req.body.username && !req.body.email) {
    return res.status(400).json({
      message: "Nothing to change. Please add a new username or email",
    });
  }
  // getting the user using the params
  const userToUpdate = await User.findOne(req.params);
  if (!userToUpdate) {
    return res.status(400).json({ message: "User not found" });
  }

  // if the username is filled, checking that it is correct
  if (req.body.username) {
    // checking if the user name is different than the actual one
    if (req.body.username === req.params.username) {
      return res
        .status(400)
        .json({ errorMessage: "This is already your username." });
    }
    const existingUser = await User.findOne({ username: req.body.username });
    // If the user is found, send the message username is taken
    if (existingUser) {
      return res.status(400).json({ errorMessage: "Username already taken." });
    }

    updatedValue.username = req.body.username;
  }
  // To be added
  // if(req.body.email){

  // }
  if (req.body.email) {
    // checking if the user name is different than the actual one
    if (req.body.email === userToUpdate.email) {
      return res
        .status(400)
        .json({ errorMessage: "This is already your email." });
    }
    const existingUser2 = await User.findOne({ email: req.body.email });
    // If the user is found, send the message username is taken
    if (existingUser2) {
      return res.status(400).json({ errorMessage: "Email already taken." });
    }
    if (req.body.email === userToUpdate.email) {
      return res
        .status(400)
        .json({ errorMessage: "This is already your email." });
    }
    updatedValue.email = req.body.email;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userToUpdate._id,
    updatedValue,
    {
      new: true,
    }
  ).select("-password");

  res.status(200).json({ message: "user updated", User: updatedUser });
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
