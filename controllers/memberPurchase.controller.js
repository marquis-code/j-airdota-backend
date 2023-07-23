const MemberPurchase = require("../models/memberPurchase.model");
const mongoose = require("mongoose");

module.exports.handle_new_memberPurchase = async (req, res) => {
  try {
    const purchase = await MemberPurchase.findOne({
      user: req.body.user,
    });
    if (purchase) {
      return res.status(404).json({ errorMessage: "Email already attached to a membership purchase" });
    }

    const newMembershipPurchase = new MemberPurchase({
      purchaseItem: req.body.purchaseItem,
      memberRegion: req.body.memberRegion,
      user: req.body.user,
      journalPurchased: req.body.journalPurchased,
      price: req.body.price,
    });

    newMembershipPurchase
      .save()
      .then(() => {
        return res
          .status(200)
          .json({ successMessage: "Membership purchase was successful" });
      })
      .catch((error) => {
        return res.status(500).json({
          errorMessage:
            "Something went wrong while saving membership purchase. Please try again later",
        });
      });
  } catch (error) {
    return res.status(500).json({
      errorMessage: "Something went wrong. Please try again later",
    });
  }
};

module.exports.get_all_memberPurchases = async (req, res) => {
  try {
    const purchase = await MemberPurchase.find();
    if (!purchase) {
      return res
        .status(500)
        .json({ errorMessage: "Member purchase not available" });
    }
    return res.status(200).json(purchase);
  } catch (error) {
    return res.status(500).json({
      errorMessage:
        "Something went wrong while fetching purchase's. Please try again later",
    });
  }
};
module.exports.get_one_memberPurchase = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid member purchase ID" });
  }
  try {
    const purchase = await MemberPurchase.findById(_id);
    if (!purchase) {
      return res
        .status(404)
        .json({ errorMessage: "Membership purchase does not exist" });
    }
    return res.status(200).json(purchase);
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again later." });
  }
};

module.exports.delete_memberPurchase = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid member purchase ID" });
  }
  try {
    let purchase = await MemberPurchase.findById(_id);
    await purchase.remove();
    return res.status(200).json({
      successMessage: "Member Purchase was successfully removed",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again." });
  }
};