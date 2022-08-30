const router = require('express').Router();
const City = require('../models/City.model');

router.get('/', async (req, res) => {
    const findAllActivities = await City.find();
    res.json({ findAllActivities });
});

module.exports = router;
