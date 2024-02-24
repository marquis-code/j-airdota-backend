const mongoose = require("mongoose");

let subscriptionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "please enter email address"],
    }
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

subscriptionSchema.set("toJSON", {
  virtuals: true,
});

const Subscription = mongoose.model("subscription", subscriptionSchema);

module.exports = Subscription;