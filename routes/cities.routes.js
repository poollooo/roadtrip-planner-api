const router = require('express').Router();
const City = require('../models/City.model');

router.get('/', async (req, res) => {
    try {
        const allCities = await City.find();
        res.json({ allCities });
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
