const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

let memberSchema = new mongoose.Schema(
  {
    memberType: {
      type: String,
      emum: ["academy", "lab"],
      default: "academy",
    },
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
      lowercase: true,
      required: [true, "please enter an email"],
      unique: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
      lowercase: true,
      required: [true, "please enter your address"],
    },
    postalCode: {
      type: String,
      lowercase: true,
      required: [true, "please enter your postal code"],
    },
    preferredContactMode: {
      type: String,
      emum: ["phone", "email", 'any'],
      default: "email",
    }
  },
  {
    timestamps: true,
  }
);

memberSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

memberSchema.set("toJSON", {
  virtuals: true,
});


const Member = mongoose.model("member", memberSchema);

module.exports = Member;