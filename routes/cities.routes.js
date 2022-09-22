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

router.get('/:name', async (req, res) => {
    try {
        console.log(req.params.name);
        const cityByName = await City.findOne({ name: req.params.name })
        res.json(cityByName)
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;
