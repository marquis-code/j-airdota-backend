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
      required: [true, "p lease enter an email"],
      unique: true,
      validate: [isEmail, "Please enter a valid email"],
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

userSchema.statics.login = async function (email, password) {
  const user = this.findOne({ email });
  if (user) {
    let auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Invalid password");
  }
  throw Error("Invalid email");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
