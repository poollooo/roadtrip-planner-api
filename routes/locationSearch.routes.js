const axios = require('axios');
<<<<<<< Updated upstream
=======
const router = require('express').Router();
>>>>>>> Stashed changes

const options = {
  method: 'GET',
  url: 'https://travel-advisor.p.rapidapi.com/locations/search',
  params: {
<<<<<<< Updated upstream
    query: 'paris',
=======
    query: '',
>>>>>>> Stashed changes
    limit: '30',
    offset: '0',
    units: 'km',
    location_id: '1',
    currency: 'USD',
    sort: 'relevance',
    lang: 'en_US',
  },
  headers: {
    'X-RapidAPI-Key': '493c0acd02mshe1541023f7b1b63p14ff8bjsn9faf9195fbd3',
    'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
  },
};

<<<<<<< Updated upstream
axios
  .request(options)
  .then(({ data }) => {
    console.log(data.data[0].result_object.location_id);
  }).catch((error) => {
    console.log(error);
  });
=======
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

>>>>>>> Stashed changes
