/* eslint-disable max-len */
const router = require('express').Router();
const axios = require('axios');
const { getLocationId } = require('../middleware/getLocationId');
const ActivitiesTemp = require('../models/ActivitiesTemp.model');

const optionsRestaurant = {
  method: 'GET',
  url: 'https://travel-advisor.p.rapidapi.com/restaurants/list',
  params: {
    location_id: '',
    currency: 'USD',
    lunit: 'km',
    limit: '30',
    lang: 'en_US',
  },
  headers: {
    'X-RapidAPI-Key': process.env.XRapidAPIKey,
    'X-RapidAPI-Host': process.env.XRapidAPIHost,
  },
};

const optionsActivities = {
  method: 'GET',
  url: 'https://travel-advisor.p.rapidapi.com/attractions/list',
  params: {
    location_id: '',
    currency: 'USD',
    lang: 'en_US',
    lunit: 'km',
    limit: '30',
    sort: 'recommended',
  },
  headers: {
    'X-RapidAPI-Key': process.env.XRapidAPIKey,
    'X-RapidAPI-Host': process.env.XRapidAPIHost,
  },
};

// the route is {baseUrl}/api/search/:citySearched

function getHours(hoursArray) {
  // if the hours array is empty, it means the restaurant is closed
  if (!hoursArray) {
    const emptyArray = [0, 0];
    return emptyArray;
  }
  const newHours = hoursArray.map((hour) => [hour[0]?.open_time || 0, hour[0]?.close_time || 0]);
  return newHours;
}

router.get('/:citySearched', getLocationId, async (req, res, next) => {
  try {
    optionsRestaurant.params.location_id = req.locationSearchedId;
    optionsActivities.params.location_id = req.locationSearchedId;
    let restaurantList;
    let activityList;
    await ActivitiesTemp.deleteMany();

    await axios.request(optionsRestaurant)
      .then((response) => {
        restaurantList = response.data.data;

        restaurantList = restaurantList.map((restaurant) => {
          const newRestaurant = {
            locationId: restaurant.location_id,
            name: restaurant.name,
            description: restaurant.description,
            numberOfReviews: restaurant.num_reviews,
            photo: restaurant.photo?.images?.large?.url,
            rawRating: restaurant.raw_ranking,
            ranking: restaurant.ranking,
            priceLevel: restaurant.price_level,
            priceRange: restaurant.price,
            tripAdvisorUrl: restaurant.web_url,
            category: restaurant.category?.key,
            phone: restaurant.phone,
            website: restaurant.website,
            email: restaurant.email,
            address: restaurant.address,
            hours: getHours(restaurant.hours?.week_ranges),
          };
          //   const restaurantToCheck = ActivitiesTemp.find({ locationId: newRestaurant.locationId });
          //   console.log(restaurantToCheck);
          //   if (!restaurantToCheck) {
          if (newRestaurant.name) {
            console.log('inside !restauToCheck');
            return ActivitiesTemp.create(newRestaurant);
          }
        //   }
        });
        Promise.all(restaurantList);
      })
      .catch((error) => {
        console.error(error);
      });

    await axios.request(optionsActivities)
      .then((response) => {
        activityList = response.data.data;
        activityList = activityList.map((activity) => {
          const newActivity = {
            locationId: activity.location_id,
            name: activity.name,
            description: activity.description,
            numberOfReviews: activity.num_reviews,
            photo: activity.photo?.images?.large?.url,
            rawRating: activity.raw_ranking,
            ranking: activity.ranking,
            priceLevel: activity.price_level,
            priceRange: activity.price,
            tripAdvisorUrl: activity.web_url,
            category: activity.category?.key,
            phone: activity.phone,
            website: activity.website,
            email: activity.email,
            address: activity.address,
            hours: getHours(activity.hours?.week_ranges),
          };
          //   const activityToCheck = ActivitiesTemp.findOne({ locationId: newActivity.locationId });
          //   console.log(activityToCheck.locationId);
          //   if (!activityToCheck) {
          if (newActivity.name) {
            return ActivitiesTemp.create(newActivity);
          }
        //   }
        });
        Promise.all(activityList);
      })
      .catch((error) => {
        console.error(error);
      });
    // console.log(restaurantList, activityList);
    // ActivitiesTemp.create(restaurantList);
    res.status(200).json({ restaurantList, activityList });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
