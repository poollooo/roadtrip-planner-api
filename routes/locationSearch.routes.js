const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://travel-advisor.p.rapidapi.com/locations/search',
  params: {
    query: 'paris',
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

axios
  .request(options)
  .then(({ data }) => {
    console.log(data.data[0].result_object.location_id);
  }).catch((error) => {
    console.log(error);
  });
