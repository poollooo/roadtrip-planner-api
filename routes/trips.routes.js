const router = require("express").Router();
const Trip = require("../models/Trip.model");
const SelectedActivities = require("../models/SelectedActivities.model");
const isAuthenticated = require("../middleware/isAuthenticated");
const { isValid } = require("../middleware/isValid");
const Activities = require("../models/Activities.model");

router.get("/", async (req, res, next) => {
  try {
    const findAll = await Trip.find();
    res.json({ findAll });
  } catch (error) {
    next(error);
  }
});

function getIdOfActivity(params) {
  try {
    return Activities.findOne({
      activityLocationId: params,
    }).select({ _id: 1 });
  } catch (error) {
    next(error);
  }
}

// Create trip and all it's activities
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { newActivityList, startDate, endDate, name, cityLocationId } =
      req.body;
    const user = req.user;

    const tripCreated = await Trip.create({
      userId: user._id,
      cityId: cityLocationId,
      startDate,
      endDate,
      name,
    });

    //doing a map to find the ID of the activies (stored in database) in  order to have a reference for the populate in the get route
    const idActivityPromises = newActivityList.map((activity) => {
      return getIdOfActivity(activity.activityLocationId);
    });

    //waiting for all the promises
    const idActivities = await Promise.all(idActivityPromises);

    const newActivitiesPromise = newActivityList
      .map((activity, index) => {
        if (!idActivities[index]) {
          return;
        }

        return SelectedActivities.create({
          startDate: activity.startDate,
          endDate: activity.endDate,
          name: activity.name,
          tripId: tripCreated._id,
          //adding the found ID while creating the activities
          activityId: idActivities[index].id,
        });
      })
      .filter((x) => x);

    const activities = await Promise.all(newActivitiesPromise);
    res.status(200).json({ tripCreated, activities });
  } catch (error) {
    //res.status(400).json("Bad request");

    next(error);
  }
});

// Get all Trips List of a user by username
router.get("/all", isAuthenticated, async (req, res, next) => {
  try {
    const trip = await Trip.find({ userId: req.user.id });
    res.status(200).json(trip);
  } catch (error) {
    res.status(404).json("Trip Not Found !");
    next(error);
  }
});

// Get one specific Trip by tripId with activities List
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
    }).populate("activityId");

    res.status(200).json({ tripFound, activitiesFound });
  } catch (error) {
    next(error);
  }
});

// Modify One specific Trip's activities by tripId
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

// Delete all Trips & selectedActivities of a user by userId
router.delete("/all", isAuthenticated, async (req, res, next) => {
  try {
    const allTrips = await Trip.find({ userId: req.user.id });

    const allTripsIdDeleted = allTrips.map((trip) => {
      return SelectedActivities.deleteMany({ tripId: trip._id });
    });

    await Promise.all(allTripsIdDeleted);

    await Trip.deleteMany({ userId: req.user.id });
    res
      .status(200)
      .json(
        "You don't have planned trips anymore, do you want to go an a new adventure?"
      );
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
