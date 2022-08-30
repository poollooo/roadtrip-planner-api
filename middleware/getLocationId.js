const axios = require("axios");

const options = {
  method: "GET",
  url: "https://travel-advisor.p.rapidapi.com/locations/search",
  params: {
    query: "",
    limit: "30",
    offset: "0",
    units: "km",
    location_id: "1",
    currency: "USD",
    sort: "relevance",
    lang: "en_US",
  },
  headers: {
    "X-RapidAPI-Key": process.env.XRapidAPIKey,
    "X-RapidAPI-Host": process.env.XRapidAPIHost,
  },
};

module.exports.getLocationId = async (req, res, next) => {
  const { citySearched } = req.params;
  options.params.query = citySearched;
  axios
    .request(options)
    .then(({ data }) => {
      const locationSearchedId = data.data[0].result_object.location_id;
      req.locationSearchedId = locationSearchedId;
      req.locationNameId = data.data[0].result_object.name;
      next();
    })
    .catch((error) => {
      next(error);
    });
};
