const mongoose = require("mongoose");
const { isEmail } = require("validator");

let guestSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "please enter username"],
      unique: true,
    },
    lastName: {
      type: String,
      required: [true, "please enter username"],
      unique: true,
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
    password: {
      type: String,
      required: [true, "please enter a password"],
      minlength: [6, "Minimum password length is 6 characters"],
    },
    role: {
      type: String,
      emum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

guestSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

guestSchema.set("toJSON", {
  virtuals: true,
});

guestSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});


const Guest = mongoose.model("guest", guestSchema);

module.exports = Guest;