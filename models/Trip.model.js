const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const tripSchema = new Schema({

  userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  name: Schema.Types.String,
  locationId: { type: Schema.Types.Number, require: true },
  startDate: { type: Schema.Types.Date, require: true },
  endDate: { type: Schema.Types.Date, require: true },
});

const Trip = model("Trip", tripSchema);

module.exports = Trip;
