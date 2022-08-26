const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const router = require('express').Router();
const activitiesRoutes = require('./activities.routes');
const citiesRoutes = require('./cities.routes');
const locationSearchRoutes = require('./locationSearch.routes');
const tripListRoutes = require('./tripList.routes'); 

/* GET home page */
router.get('/', (req, res, next) => {
  res.json('All good in here');
});

router.use('/auth', authRoutes);
router.use('/search', locationSearchRoutes);
router.use('/activities', activitiesRoutes);
router.use('/cities', citiesRoutes);
router.use("/tripList", tripListRoutes);
router.use('/users', userRoutes);
module.exports = router;
