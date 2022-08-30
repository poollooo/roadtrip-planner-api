const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const citiesSchema = new Schema({
  cityLocationId: { type: Schema.Types.Number, required: true, unique: true },
  name: Schema.Types.String,
});

const City = model("City", citiesSchema);

module.exports = City;
