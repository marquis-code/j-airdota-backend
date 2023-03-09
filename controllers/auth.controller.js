const User = require("../models/user.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleErrors = (err) => {
  let errors = {
    username: "",
    email: "",
    password: "",
  };

  if (err.code === 11000) {
    errors.email = "Email already exist!";
    return errors;
  }

  if (err.message.includes("user validation error")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  if (err.message === "Invalid password") {
    errors.password = "Invalid email or password";
  }

  if (err.message === "Invalid email") {
    errors.email = "Invalid email or password";
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
  return accessToken;
};

module.exports.signup_handler = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errorMessage: "User Already Exist" });
    }

    const new_user = await User.create({
      username,
      email,
      password,
    });

    const token = createToken(new_user._id);
    res.cookie("jwt", token, {
      maxAge: maxAge * 1000,
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({ user: new_user._id });
  } catch (error) {
    let errors = handleErrors(error);
    return res.json({
      errors,
    });
  }
};

module.exports.login_handler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw Error("Invalid email");
    }
    let auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      throw Error("Invalid password");
    }

    const token = createToken(user._id);
    res.cookie("jwt", token, {
      maxAge: maxAge * 1000,
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({ user: user._id });
  } catch (error) {
    let errors = handleErrors(error);
    return res.json({
      errors,
    });
  }
};

module.exports.logout_handler = (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    return res.status(200).json({ successMessage: "Logout was successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again" });
  }
};

module.exports.reset_handler = (req, res, next) => {};
