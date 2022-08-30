const router = require("express").Router();
const Trip = require("../models/Trip.model");
const SelectedActivities = require("../models/SelectedActivities.model");
const isAuthenticated = require('../middleware/isAuthenticated'); 
const Activities = require('../models/Activities.model')

// {
//             "locationId": "1903734",
//             "name": "Frog XVI",
//             "description": "FROG XVI is situated in the 16th arrondissement, one of the capital's most cosmopolitan quarters, popular with tourists and Parisians alike. FROG XVI is stylishly decorated whilst conserving the warmth and conviviality of an English pub. We're proud to boast a magnificent microbrewery and a bar/restaurant on two levels.",
//             "numberOfReviews": "1817",
//             "photo": "https://media-cdn.tripadvisor.com/media/photo-p/1a/ae/af/6f/photo0jpg.jpg",
//             "rawRating": "4.8437275886535645",
//             "ranking": "#3 of 17,972 Results",
//             "priceLevel": "$$ - $$$",
//             "priceRange": "$11 - $17",
//             "tripAdvisorUrl": "https://www.tripadvisor.com/Restaurant_Review-g187147-d1903734-Reviews-Frog_XVI-Paris_Ile_de_France.html",
//             "category": "restaurant",
//             "phone": "+33 1 42 77 08 21",
//             "website": "http://www.frogpubs.com/pub-frog-xvi-paris-5.php",
//             "email": "jonathan.frey@frogpubs.com",
//             "address": "110 B avenue Kleber, 75116 Paris France",
//             "hours": [
//                 [
//                     720,
//                     1470
//                 ],
//                 [
//                     720,
//                     1470
//                 ],
//                 [
//                     720,
//                     1470
//                 ],
//                 [
//                     720,
//                     1560
//                 ],
//                 [
//                     720,
//                     1560
//                 ],
//                 [
//                     720,
//                     1560
//                 ],
//                 [
//                     720,
//                     1470
//                 ]
//             ]
//         }
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { newActivityList } = req.body;
    const user = req.user;

    const tripCreated = await Trip.create({
      userId: user._id,
      cityLocationId: newActivityList.cityLocationId,
    });

    newActivityList.forEach(async (activity) => {
      await SelectedActivities.create({
        tripId: tripCreated._id,
        activitiesId: activity.locationId,
      }); 
    });

    const allSelectedActivities = SelectedActivities.find({
      tripId: tripCreated._id,
    });

    // const temp = {tripCreated, allSelectedActivities}
    res.status(200).json(tripCreated);
  } catch (error) {
    res.status(400).json("Bad request");
    next(error);
  }
});

//user id 
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    const SelectedActivities = await SelectedActivities.find(id);
    res.status(200).json({ trip, activities });
  } catch (error) {
    next(error);
  }
});


// trip id 
router.patch("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { tripId } = req.params;
    await SelectedActivities.findOneAndUpdate({ tripId: tripId }, req.body, {
      new: true,
    });
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

//trip id 
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { tripId } = req.params;
    await Trip.findByIdAndDelete(tripId);
    await SelectedActivities.findOneAndDelete({ tripId: tripId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
