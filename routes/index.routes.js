const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const router = require("express").Router();
const locationSearchRoutes = require('./locationSearch.routes');

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use('/auth', authRoutes);
router.use('/search', locationSearchRoutes);
router.use("/users", userRoutes);

module.exports = router;
