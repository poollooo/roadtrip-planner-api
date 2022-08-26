const router = require('express').Router();
const axios = require('axios');
const { getLocationId } = require('../middleware/getLocationId');

const optionsRestaurant = {
  method: 'GET',
  url: 'https://travel-advisor.p.rapidapi.com/restaurants/list',
  params: {
    location_id: '',
    currency: 'USD',
    lunit: 'km',
    limit: '30',
    lang: 'en_US',
  },
  headers: {
    'X-RapidAPI-Key': process.env.XRapidAPIKey,
    'X-RapidAPI-Host': process.env.XRapidAPIHost,
  },
};

const optionsActivities = {
  method: 'GET',
  url: 'https://travel-advisor.p.rapidapi.com/attractions/list',
  params: {
    location_id: '',
    currency: 'USD',
    lang: 'en_US',
    lunit: 'km',
    sort: 'recommended',
  },
  headers: {
    'X-RapidAPI-Key': process.env.XRapidAPIKey,
    'X-RapidAPI-Host': process.env.XRapidAPIHost,
  },
};

// the route is {baseUrl}/api/search/:citySearched

router.get('/:citySearched', getLocationId, async (req, res, next) => {
  try {
    optionsRestaurant.params.location_id = req.locationSearchedId;
    optionsActivities.params.location_id = req.locationSearchedId;
    let restaurantList;
    let attractionList;

    await axios.request(optionsRestaurant)
      .then((response) => {
        console.log(response.data.data);
        restaurantList = response.data.data;
      }).catch((error) => {
        console.error(error);
      });

    await axios.request(optionsActivities)
      .then((response) => {
        console.log(response.data.data);
        attractionList = response.data.data;
      }).catch((error) => {
        console.error(error);
      });
    res.status(200).json({ restaurantList, attractionList });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
