const router = require('express').Router();
const City = require('../models/City.model');

router.get('/', async (req, res) => {
    const findAllActivities = await City.find();
    res.json({ findAllActivities });
});

router.get('/:id', async (req, res) => {
    const cityById = await City.findById(req.params.id)
    res.json({ cityById })
})


module.exports = router;
