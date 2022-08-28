const router = require("express").Router();
const mongoose = require("mongoose");
const getLocationId = require("../middleware/getLocationId");
const Trip = require("../models/Trip.model");
const Activities = require("../models/Activities");

router.post("/", async (req, res, next) => {
  try {
    const { userId, startDate, endDate } = req.body;
    const { locationId } = req.locationSearchedId;

    const tripListCreated = Trip.create({
      userId,
      locationId,
      startDate,
      endDate,
    });

    const tripId = tripListCreated._id;

    const activitiesCreated = Activities.create({
      categories,
      locationId,
      startDate,
      endDate,
      note,
      tripId,
    });

    res.status(200).json(tripListCreated);
  } catch (error) {
    res.status(400).json("Bad request");
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { id } = req.params;
    const tripList = await Trip.findById(id);
    const activities = await Activities.findById(id);
    res.status(200).json({ tripList, activities });
  } catch (error) {
    next(error);
  }
});

module.exports = router;