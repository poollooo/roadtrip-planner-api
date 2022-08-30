const City = require("../models/Cities.model");

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
        name: req.locationNameId,
      });
      //res.status(201).json({ Message: "City added", newCity });
      console.log({ Message: "City added", newCity });
      next();
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    next(error);
  }
};
