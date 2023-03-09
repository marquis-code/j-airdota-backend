const mongoose = require("mongoose");

let subscriptionSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "please enter first name"],
    },

    lastName: {
      type: String,
      required: [true, "please enter last name"],
    },

    email: {
      type: String,
      required: [true, "please enter email address"],
    },

    phone: {
      type: String,
      required: [true, "please enter mobile number"],
    },
    sendEmail: {
      type: Boolean,
      default: false,
    },
    sendPhone: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: [true, "please enter address"],
    },
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
