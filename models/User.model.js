const { Schema, model , SchemaTypes} = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: Schema.SchemaTypes.String,
      required: true,
      unique: true,
      min: 4,
      max: 15,
    },
    password: {
      type: Schema.SchemaTypes.String,
      required: true,
      // min: 6,
      // max: 18,
    },
    email: {
      type: Schema.SchemaTypes.String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
