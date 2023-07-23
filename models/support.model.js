const mongoose = require("mongoose");
const { isEmail } = require("validator");

let supportSchema = new mongoose.Schema(
  {
    amount: {
      type: String,
      required: [true, "please enter gift donation amount"],
    },
    supportType: {
      type: String,
      emum: ["academy_support_fund", "membership_support_fund", "excellence_fund", "travel_grants_fund", "recognition_fund", "development_grants_fund", "pandemic_crises_fund"],
      default: "student",
    },
    isRecurring: {
      type: Boolean,
      default: false,
      required: [true, "please select recurring donation option"],
    },
    firstName: {
      type: String,
      required: [true, "please enter first name"],
    },
    middleName: {
      type: String,
      required: [true, "please enter middle name"],
    },
    lastName: {
      type: String,
      required: [true, "please enter last name"],
    },
    suffix: {
      type: String,
      enum: ["Sr.", "Jr.", "II", "III", "IV"],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "please enter an email"],
      unique: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    country: {
      type: String,
      lowercase: true,
      required: [true, "please enter your country"],
    },
    address: {
      type: String,
      lowercase: true,
      required: [true, "please enter your address"],
    },
    city: {
      type: String,
      lowercase: true,
      required: [true, "please enter your city"],
    },
    state: {
      type: String,
      lowercase: true,
      required: [true, "please enter your state"],
    },
    postalCode: {
      type: Number,
      required: [true, "please enter your postal code"],
    },
    nameToRecognizeContribution: {
      type: String,
      lowercase: true,
    },
    isTributeDonation: {
      type: Boolean,
      default: false,
    },
    isGiftAnonymous: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      enum: ["Visa", "MasterCard", "AMEX"],
    },
    cardName: {
      type: String,
      required: [true, "please enter your card name"],
    },
    cardNumber: {
      type: String,
      required: [true, "please enter your number "],
      maxlength: [16, "Card Number mast be 16 characters"],
    },
    userName: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "please enter a password"],
      minlength: [6, "Minimum password length is 6 characters"],
    },
  },
  {
    timestamps: true,
  }
);

supportSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

supportSchema.set("toJSON", {
  virtuals: true,
});

const Support = mongoose.model("support", supportSchema);

module.exports = Support;