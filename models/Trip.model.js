const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const tripSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: Schema.Types.String,
    cityId: { type: Schema.Types.String, ref: "City", required: true },
    startDate: { type: Schema.Types.Date },
    endDate: { type: Schema.Types.Date },
  },
  { timestamps: true }
);

  
const Trip = model("Trip", tripSchema);

module.exports = Trip;
