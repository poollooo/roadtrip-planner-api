const { Schema, model } = require('mongoose');

const activitiesSchema = new Schema(
  {
    cityLocationId: {
      type: Schema.Types.Number,
      required: true,
    },
    activityLocationId: {
      type: Schema.Types.Number,
      unique: true,
    },
    name: {
      type: Schema.Types.String,
    },
    description: {
      type: Schema.Types.String,
    },
    numberOfReviews: {
      type: Schema.Types.String,
    },
    photo: [{
      type: Schema.Types.String,
    }],
    rawRating: {
      type: Schema.Types.Number,
    },
    ranking: {
      type: Schema.Types.String,
    },
    priceLevel: {
      type: Schema.Types.String,
    },
    priceRange: {
      type: Schema.Types.String,
    },
    tripAdvisorUrl: {
      type: Schema.Types.String,
    },
    category: {
      type: Schema.Types.String,
    },
    phone: {
      type: Schema.Types.String,
    },
    website: {
      type: Schema.Types.String,
    },
    email: {
      type: Schema.Types.String,
    },
    address: {
      type: Schema.Types.String,
    },
    hours: [{
      type: [Schema.Types.Number],
    }],
  },
  { timestamps: true },
);

const Activities = model('Activities', activitiesSchema);

module.exports = Activities;
