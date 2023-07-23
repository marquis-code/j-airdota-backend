const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

let memberSchema = new mongoose.Schema(
  {
    prefix: {
      type: String,
    },
    memberType: {
      type: String,
      emum: ["student", "professional", "retired", "special", "supporting", "sustaining"],
      default: "student",
    },
    firstName: {
      type: String,
      required: [true, "please enter first name"],
    },
    purchasedMembership: {
      type: Boolean,
      default : false
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: [true, "please enter last name"],
    },
    suffix: {
      type: String,
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
      type: String,
      lowercase: true,
      required: [true, "please enter your postal code"],
    },
    username: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "please enter your password"],
    },
    salaryRange: {
      type: String,
      required: [true, "please enter your salary range"],
    },
    reasonForJoiningAcademy: {
      type: String,
    },
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

memberSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const Member = mongoose.model("member", memberSchema);

module.exports = Member;