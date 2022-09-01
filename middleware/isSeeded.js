const City = require("../models/City.model");
const Activities = require("../models/Activities.model");

module.exports.isSeeded = async (req, res, next) => {
  req.locationSearchedId;
  req.locationNameId;
  try {
    const findCities = await City.findOne({
      cityLocationId: req.locationSearchedId,
    });
    if (!findCities) {
      const newCity = await City.create({
        cityLocationId: req.locationSearchedId,
        name: req.locationNameId.toLowerCase(),
      });

      next();
    } else {
      res.sendStatus(200)
    }
  } catch (error) {
    next(error);
  }
};
