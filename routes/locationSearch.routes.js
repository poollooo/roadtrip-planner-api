const axios = require('axios');
const router = require('express').Router();

const options = {
  method: 'GET',
  url: 'https://travel-advisor.p.rapidapi.com/locations/search',
  params: {
    query: '',
    limit: '30',
    offset: '0',
    units: 'km',
    location_id: '1',
    currency: 'USD',
    sort: 'relevance',
    lang: 'en_US',
  },
  headers: {
    'X-RapidAPI-Key': process.env.XRapidAPIKey,
    'X-RapidAPI-Host': process.env.XRapidAPIHost,
  },
};

// the route is {baseUrl}/api/search/:citySearched

router.get('/:citySearched', async (req, res, next) => {
  try {
    const { citySearched } = req.params;
    options.params.query = citySearched;

    axios.request(options)
      .then(({ data }) => {
        const locationSearchedId = data.data[0].result_object.location_id;
        console.log('locationSearchedId should be', locationSearchedId);
        return res.status(200).json(locationSearchedId);
      }).catch((error) => {
        console.log(error);
      });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
