const Subscription = require("../models/subscription.model");
const mongoose = require("mongoose");

module.exports.handle_new_subscription = async (req, res) => {
  try {
    const user = await Subscription.findOne({
      email: req.body.email,
    });
    if (user) {
      return res.status(404).json({ errorMessage: "Email already exist" });
    }

    const newSubscription = new Subscription({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      sendEmail: req.body.sendEmail,
      sendPhone: req.body.sendPhone,
    });

    newSubscription
      .save()
      .then(() => {
        return res
          .status(200)
          .json({ successMessage: "Subscription was successful" });
      })
      .catch(() => {
        return res.status(500).json({
          errorMessage:
            "Something went wrong while saving subscription. Please try again later",
        });
      });
  } catch (error) {
    return res.status(500).json({
      errorMessage: "Something went wrong. Please try again later",
    });
  }
};

module.exports.get_all_subscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    if (!subscriptions) {
      return res
        .status(500)
        .json({ errorMessage: "Subscriptions not available" });
    }
    return res.status(200).json(subscriptions);
  } catch (error) {
    return res.status(500).json({
      errorMessage:
        "Something went wrong while fetching subscriptions. Please try again later",
    });
  }
};
module.exports.get_one_subscription = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid subscription ID" });
  }
  try {
    const subscription = await Subscription.findById(_id);
    if (!subscription) {
      return res
        .status(404)
        .json({ errorMessage: "Subscription does not exist" });
    }
    return res.status(200).json(subscription);
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again later." });
  }
};

module.exports.delete_subscription = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid subscription ID" });
  }
  try {
    let subscription = await Subscription.findById(_id);
    await subscription.remove();
    return res.status(200).json({
      successMessage: "Subscription was successfully removed",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again." });
  }
};