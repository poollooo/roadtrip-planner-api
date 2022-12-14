const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const router = require('express').Router();
const activitiesRoutes = require('./activities.routes');
const citiesRoutes = require('./cities.routes');
const locationSearchRoutes = require('./locationSearch.routes');
const tripRoutes = require('./trips.routes');

/* GET home page */
router.get('/', (req, res, next) => {
  try {
    res.json('All good in here');
  } catch (error) {
    next(error);
  }
});

router.use('/auth', authRoutes);
router.use('/search', locationSearchRoutes);
router.use("/users", userRoutes);
router.use("/trips", tripRoutes);
router.use('/activities', activitiesRoutes);
router.use('/cities', citiesRoutes);
module.exports = router;
