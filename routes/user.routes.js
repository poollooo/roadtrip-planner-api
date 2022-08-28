const router = require("express").Router();
const { findOne } = require("../models/User.model");
const User = require("../models/User.model");

/* GET home page */
router.get("/", async (req, res, next) => {
  const findAll = await User.find();
  res.json({ findAll });
});

router.patch("/:username", async (req, res, next) => {
  const updatedValue = {};
  if (req.body.username) {
    updatedValue.username = req.body.username;
  }
  //To be added
  // if(req.body.email){

  // }
  if (req.body.email) {
    updatedValue.email = req.body.email;
  }
  const userToUpdate = await User.findOne(req.params);
  if (!userToUpdate) {
    res.status(400).json({ message: "User not found" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userToUpdate.id,
    updatedValue,
    {
      new: true,
    }
  );

  res.status(200).json({ message: "user updated", User: updatedUser });
});

router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
