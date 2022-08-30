const router = require('express').Router();
const Activities = require('../models/Activities.model');

router.get('/', async (req, res) => {
  const findAllActivities = await Activities.find();
  res.json({ findAllActivities });
});

module.exports = router;
