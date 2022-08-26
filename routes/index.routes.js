const router = require('express').Router();
const authRoutes = require('./auth.routes');
const locationSearchRoutes = require('./locationSearch.routes');

/* GET home page */
router.get('/', (req, res, next) => {
  res.json('All good in here');
});

router.use('/auth', authRoutes);
router.use('/search', locationSearchRoutes);

module.exports = router;
