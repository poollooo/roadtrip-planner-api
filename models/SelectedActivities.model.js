const { Schema, model } = require("mongoose");

const selectedActivitiesSchema = new Schema({
  startDate: {
    type: Schema.Types.Date,
  },
  endDate: {
    type: Schema.Types.Date,
  },
  tripId: {
    type: Schema.Types.ObjectId,
    ref: "Trip",
    required: true,
  },
  activitiesId: {
    type: Schema.Types.ObjectId,
    ref: "Activities",
    required: true,
  },
});

const SelectedActivities = model(
  "selectedActivities",
  selectedActivitiesSchema
);

module.exports = SelectedActivities;
