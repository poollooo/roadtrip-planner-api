const router = require("express").Router();
const Trip = require("../models/Trip.model");
const SelectedActivities = require("../models/SelectedActivities.model");
const isAuthenticated = require("../middleware/isAuthenticated");
const { isValid } = require("../middleware/isValid");

router.get("/", async (req, res, next) => {
  const findAll = await Trip.find();
  res.json({ findAll });
});

// Create trip and all it's activities
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { newActivityList } = req.body;
    const user = req.user;

    const tripCreated = await Trip.create({
      userId: user._id,
      cityId: newActivityList[0].cityLocationId,
      // startDate,
      // endDate,
    });

    const newActivitiesPromise = newActivityList.map(async (activity) => {
      return SelectedActivities.create({
        // startDate,
        // endDate,
        tripId: tripCreated._id,
        activityLocationId: activity.activityLocationId,
      });
    });

    const activities = await Promise.all(newActivitiesPromise);
    res.status(200).json({ tripCreated, activities });
  } catch (error) {
    res.status(400).json("Bad request");
    next(error);
  }
});

// Get all Trip List by username
router.get("/all", isAuthenticated, async (req, res, next) => {
  try {
    const trip = await Trip.find({ userId: req.user.id });
    res.status(200).json(trip);
  } catch (error) {
    res.status(404).json("Trip Not Found !");
    next(error);
  }
});

// Get one specific Trip with activities List  tripId
router.get("/:tripId", isAuthenticated, async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const tripFound = await Trip.findById(tripId);

    if (!tripFound) {
      return res.status(404).json("No trip found");
    }

    if (tripFound.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json("Not authenticated");
    }

    const activitiesFound = await SelectedActivities.find({
      tripId: tripId,
    }).populate("Activities");

    res.status(200).json(activitiesFound);
  } catch (error) {
    next(error);
  }
});

// Modifier One specific Trip's activities by tripId
router.patch("/:tripId", isAuthenticated, isValid, async (req, res, next) => {
  try {
    const { tripId } = req.params;

    const { selectedActivityId } = req.query;
    if (!tripId && !selectedActivityId)
      return res.status(404).json("Please Select One Trip / Activity !");

    //update trip startDate/endDate (all selectedActivities date update with it)
    if (tripId && !selectedActivityId) {
      await Trip.findByIdAndUpdate(tripId, req.body, { new: true });
      const activitiesToUpdate = await SelectedActivities.find({
        tripId: tripId,
      });
      const activitiesToUpdatePromise = activitiesToUpdate.map((activity) => {
        return activity.updateOne(req.body, { new: true }).exec();
      });
      await Promise.all(activitiesToUpdatePromise);
    }

    //update one specific activity's startDate / endDate
    if (tripId && selectedActivityId) {
      await SelectedActivities.findByIdAndUpdate(selectedActivityId, req.body, {
        new: true,
      });
    }

    res.status(200).json("Update Succeed !");
  } catch (error) {
    res.status(404).json("Something Went Wrong !");
    next(error);
  }
});

// Delete all Trips & selectedActivities by userId
router.delete("/all", isAuthenticated, async (req, res, next) => {
  try {
    const allTrips = await Trip.find({ userId: req.user.id });

    const allTripsIdDeleted = allTrips.map((trip) => {
      return SelectedActivities.deleteMany({ tripId: trip._id });
    });

    await Promise.all(allTripsIdDeleted);

    await Trip.deleteMany({ userId: req.user.id });
    res.status(200).json("There is nothing , new trip ? ");
  } catch (error) {
    res.status(404).json("Delete All Error");
    next(error);
  }
});

// Delete One specific Trip by tripId
router.delete("/:tripId", isAuthenticated, async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const tripFound = await Trip.findById(tripId);

    if (!tripFound) {
      return res.status(404).json("No trip found");
    }

    if (tripFound.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json("Not authenticated");
    }
    await Trip.findByIdAndRemove(tripId);
    await SelectedActivities.deleteMany({ tripId: tripId });
    res.status(200).json("Deletion Successful");
  } catch (error) {
    res.status(404).json(" Something went wrong !");
    next(error);
  }
});

module.exports = router;
