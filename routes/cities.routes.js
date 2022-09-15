const router = require('express').Router();
const City = require('../models/City.model');

router.get('/', async (req, res) => {
    try {
        const findAllActivities = await City.find();
        res.json({ findAllActivities });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const cityById = await City.findById(req.params.id)
        res.json({ cityById })
    } catch (error) {
        next(error);
    }
})


module.exports = router;
