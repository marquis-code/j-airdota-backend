const User = require("../models/user.models");
const Token = require("../models/token.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

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
const createToken = (id, role) => {
  const accessToken = jwt.sign({ id, role }, process.env.JWT_SECRET, {
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

    const token = createToken(new_user._id, new_user.role);
    res.cookie("jwt", token, {
      maxAge: maxAge * 1000,
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({ user: new_user._id, successMessage: 'Hurry! now you are successfully registred. Please login.' });
  } catch (error) {
    a
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

    const token = createToken(user._id, user.role);
    res.cookie("jwt", token, {
      maxAge: maxAge * 1000,
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({ user: user._id, successMessage: '"You are now logged in."' });
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

module.exports.request_reset_handler = async (req, res, next) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ errorMessage: "User with given email does not exist" });
    }

    let token = await Token.findOne({ userId: user._id });

    // if (token) await token.deleteOne();

    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${process.env.clientURL}/passwordReset?token=${token.token}&id=${user._id}`;
    await sendEmail(
      user.email,
      "Password reset request",
      { name: user.username, link: link },
      "../templates/requestResetPassword.handlebars"
    );

    return res.status(200).json({
      successMessage: "Reset Password link has been sent successfully",
    });
  } catch (error) {
    return res.status(500).json({ errorMessage: "Something went wrong." });
  }
};

module.exports.reset_handler = async (req, res) => {
  const userId = req.params.userId;
  const { password } = req.body;
  try {
    let user = await User.findById({ _id: userId });

    if (!user) {
      return res.status(400).json({ errorMessage: "Invalid link or expired." });
    }

    const passwordResetToken = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!passwordResetToken) {
      return res.status(400).json({ errorMessage: "Invalid link or expired." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, Number(salt));

    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );

    await passwordResetToken.delete();

    await sendEmail(
      user.email,
      "Password Reset Successfully",
      {
        name: user.username,
      },
      "../templates/resetPassword.handlebars"
    );

    await passwordResetToken.deleteOne();

    return res
      .status(200)
      .json({ successMessage: "Password Reset was successfully" });
  } catch (error) {
    return res.status(500).json({ errorMessage: "Something went wrong." });
  }
};
