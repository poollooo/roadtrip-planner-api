const router = require("express").Router();
const mongoose = require("mongoose");
const getLocationId = require("../middleware/getLocationId");
const Trip = require("../models/Trip.model");
const Activities = require("../models/Activities");

// {
//     "location_id": "13511379",
//     "name": "Restaurant Bougainville",
//     "description": "",
//     "numberOfReviews": "245",
//     "photo": {
//         "images": {
//             "small": {
//                 "width": "150",
//                 "url": "https://media-cdn.tripadvisor.com/media/photo-l/18/58/3a/b9/dam-square.jpg",
//                 "height": "150"
//             },
//             "thumbnail": {
//                 "width": "50",
//                 "url": "https://media-cdn.tripadvisor.com/media/photo-t/18/58/3a/b9/dam-square.jpg",
//                 "height": "50"
//             },
//             "original": {
//                 "width": "1280",
//                 "url": "https://media-cdn.tripadvisor.com/media/photo-o/18/58/3a/b9/dam-square.jpg",
//                 "height": "853"
//             },
//             "large": {
//                 "width": "1024",
//                 "url": "https://media-cdn.tripadvisor.com/media/photo-w/18/58/3a/b9/dam-square.jpg",
//                 "height": "682"
//             },
//             "medium": {
//                 "width": "550",
//                 "url": "https://media-cdn.tripadvisor.com/media/photo-s/18/58/3a/b9/dam-square.jpg",
//                 "height": "367"
//             }
//         },
//         "is_blessed": true,
//         "uploaded_date": "2019-07-16T15:45:59-0400",
//         "caption": "Dam Square",
//         "id": "408435385",
//         "helpful_votes": "2",
//         "published_date": "2019-07-16T15:45:59-0400",
//         "user": {
//             "user_id": null,
//             "member_id": "0",
//             "type": "user"
//         }
//     },
//     "rawRating": "4.835379600524902",
//     "ranking": "#1 of 4,107 Results",
//     "priceLevel": "$$$$",
//     "priceRange": "$99 - $119",
//     "tripAdvisorUrl": "https://www.tripadvisor.com/Restaurant_Review-g188590-d13511379-Reviews-Restaurant_Bougainville-Amsterdam_North_Holland_Province.html",
//     "category": {
//         "key": "restaurant",
//         "name": "Restaurant"
//     },
//     "phone": "+31 20 218 2182",
//     "website": "http://www.restaurantbougainville.com/",
//     "email": "reservations@restaurantbougainville.com",
//     "address": "Dam 27 In Hotel TwentySeven, 1012 JS Amsterdam The Netherlands",
//     "hours": {
//         "week_ranges": [
//             [
//                 {
//                     "open_time": 1110,
//                     "close_time": 1320
//                 }
//             ],
//             [
//                 {
//                     "open_time": 1110,
//                     "close_time": 1320
//                 }
//             ],
//             [
//                 {
//                     "open_time": 1110,
//                     "close_time": 1320
//                 }
//             ],
//             [
//                 {
//                     "open_time": 1110,
//                     "close_time": 1320
//                 }
//             ],
//             [
//                 {
//                     "open_time": 1110,
//                     "close_time": 1320
//                 }
//             ],
//             [
//                 {
//                     "open_time": 1110,
//                     "close_time": 1320
//                 }
//             ],
//             [
//                 {
//                     "open_time": 1110,
//                     "close_time": 1320
//                 }
//             ]
//         ],
//         "timezone": "Europe/Amsterdam"
//     }
// }



router.post("/", async (req, res, next) => {
  try {
    const { userId, startDate, endDate } = req.body;
    const { locationId } = req.locationSearchedId;

    const tripCreated = Trip.create({
      userId,
      locationId,
      startDate,
      endDate,
    });

    const tripId = tripCreated._id;

    const activitiesListCreated = Activities.create({
      categories,
      locationId,
      startDate,
      endDate,
      note,
      tripId,
    });
    res.status(200).json({ tripCreated, activitiesListCreated });
  } catch (error) {
    res.status(400).json("Bad request");
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    const activities = await Activities.findById(id);
    res.status(200).json({ trip, activities });
  } catch (error) {
    next(error);
  }
});

router.patch("/", async (req, res, next) => {
  try {
    const { tripId } = req.params;
    Activities.findOneAndUpdate({ tripId: tripId }, req.body, { new: true });
    res.status(200).json()
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const { tripId } = req.params;
    await Trip.findByIdAndDelete(tripId);
    await Activities.findOneAndDelete({ tripId: tripId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
