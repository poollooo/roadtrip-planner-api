const router = require("express").Router();
const User = require("../models/User.model");

/* GET home page */
router.get("/", async (req, res, next) => {
  const findAll = await User.find();
  res.json({ findAll });
});

module.exports = router;
