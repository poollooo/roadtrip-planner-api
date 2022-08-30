const router = require("express").Router();
const Trip = require("../models/Trip.model");
const SelectedActivities = require("../models/SelectedActivities.model");
const isAuthenticated = require("../middleware/isAuthenticated");
const Activities = require("../models/Activities.model");
const Cities = require("../models/Cities.model");
const User =require("../models/User.model")

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
        activitiesId: activity.activityLocationId,
      });

    });

   const data =  await Promise.all(newActivitiesPromise);

    res.status(200).json(data);
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
    next(error);
  }
});

// Get one specific Trip with activities List  tripId
router.get("/:tripId", isAuthenticated, async (req, res, next) => {
  try {
    const { tripId } = req.params; 
    const tripFound = await Trip.findById(tripId);

    if (!tripFound) {
      return res.status(404).json('No trip found'); 
    } 

    if (tripFound.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json("Not authenticated");
    }
    

    const activitiesFound = await SelectedActivities.find({ tripId: tripId }); 

    res.status(200).json(activitiesFound);
  } catch (error) {
    next(error);
  }
});

//todo Modifier One specific Trip by tripId
router.patch("/:tripId", isAuthenticated, async (req, res, next) => {
  try {
    const { username } = req.params;
    await SelectedActivities.findOneAndUpdate({ tripId: tripId }, req.body, {
      new: true,
    });
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});


// Delete all Trips & selectedActivities by userId
router.delete("/all", isAuthenticated , async (req, res, next) => {
  try {
    const allTrips = await Trip.find({ userId: req.user.id });

    const allTripsIdDeleted = allTrips.map((trip) => {
     return SelectedActivities.deleteMany({ tripId : trip._id });
    });

    await Promise.all(allTripsIdDeleted);

    await Trip.deleteMany({ userId: req.user.id });
  } catch (error) {
    next(error);
  }
});

// Delete One specific Trip tripId
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
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;
