const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

let userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "please enter username"],
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "please enter an email"],
      unique: [true, "email already exists in database!"],
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: '{VALUE} is not a valid email!'
      }
      // validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "please enter a password"],
      minlength: [6, "Minimum password length is 6 characters"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      emum: ["admin", "user"],
      default: "user",
    },
    created: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});


const User = mongoose.model("user", userSchema);

module.exports = User;