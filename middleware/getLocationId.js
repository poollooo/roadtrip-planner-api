const axios = require("axios");
const City = require("../models/City.model");
const Activities = require("../models/Activities.model");

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
  const citySeeded = await City.findOne({ name: citySearched.toLowerCase() });

  if (citySeeded) {
    const newActivityList = await Activities.find({ cityLocationId: citySeeded.cityLocationId });
    res.status(200).json({ newActivityList });
  } else {
    options.params.query = citySearched;
    axios
      .request(options)
      .then(({ data }) => {
        const locationSearchedId = data.data[0].result_object.location_id;
        req.locationSearchedId = locationSearchedId;
        req.locationNameId = data.data[0].result_object.name;
        req.locationImage = data.data[0].result_object.photo.images.original.url;
        req.description = data.data[0].result_object.geo_description;
        const newCity = City.create({
          cityLocationId: req.locationSearchedId,
          name: req.locationNameId.toLowerCase(),
          image: req.locationImage,
          description: req.description
        });
        next()
      })
      .catch((error) => {
        next(error);
      });
  }
};
