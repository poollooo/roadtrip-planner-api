const router = require('express').Router();
const Activities = require('../models/Activities.model');

router.get('/', async (req, res) => {
  try {

    const findAllActivities = await Activities.find();
    res.json({ findAllActivities });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
