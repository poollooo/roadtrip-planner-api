const router = require('express').Router();
const { getLocationId } = require('../middleware/getLocationId');

// the route is {baseUrl}/api/search/:citySearched

router.get('/:citySearched', getLocationId, (req, res, next) => {
  try {
    // console.log(req.locationSearchedId);
    // console.log(req);
    // console.log(res);
    res.json({ local: req.locationSearchedId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
