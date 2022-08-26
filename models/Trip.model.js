const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const tripSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  name: Schema.Types.String,
  locationId: Schema.Types.Number,
  startDate: Schema.Types.Date,
  endDate: Schema.Types.Date,
});

const Trip = model("Trip", tripSchema);

module.exports = Trip;
