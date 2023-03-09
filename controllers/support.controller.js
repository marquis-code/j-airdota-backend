const bcrypt = require("bcrypt");
const Support = require("../models/support.model");

module.exports.handle_new_support = async (req, res) => {
  try {
    const supporter = await Support.findOne({
      email: req.body.email,
    });
    if (supporter) {
      return res.status(404).json({
        errorMessage: `Supporter with Email ${req.body.email} already exist`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newSupporter = new Support({
      amount: req.body.amount,
      isRecurring: req.body.isRecurring,
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      suffix: req.body.suffix,
      email: req.body.email,
      country: req.body.country,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      nameToRecognizeContribution: req.body.nameToRecognizeContribution,
      isTributeDonation: req.body.isTributeDonation,
      paymentMethod: req.body.paymentMethod,
      cardNumber: req.body.cardNumber,
      cardName: req.body.cardName,
      password: hashedPassword,
    });

    newSupporter
      .save()
      .then(() => {
        return res.status(200).json({
          successMessage: "New support has been successfully registered",
        });
      })
      .catch(() => {
        return res.status(500).json({
          errorMessage:
            "Something went wrong while saving support. Please try again later",
        });
      });
  } catch (error) {
    return res.status(500).json({
      errorMessage: "Something went wrong. Please try again later",
    });
  }
};

module.exports.get_all_supports = async (req, res) => {
  try {
    const supports = await Support.find();
    if (!supports) {
      return res.status(500).json({ errorMessage: "Supports not available" });
    }
    return res.status(200).json(supports);
  } catch (error) {
    return res.status(500).json({
      errorMessage:
        "Something went wrong while fetching supports. Please try again later",
    });
  }
};
module.exports.get_one_support = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid support ID" });
  }
  try {
    const support = await Support.findById(_id);
    if (!support) {
      return res.status(404).json({ errorMessage: "Support does not exist" });
    }
    return res.status(200).json(support);
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again later." });
  }
};

module.exports.delete_support = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid support ID" });
  }
  try {
    let support = await Support.findById(_id);
    await support.remove();
    return res.status(200).json({
      successMessage: "Support was successfully removed",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again." });
  }
};

module.exports.update_support = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid support ID" });
  }
  try {
    let support = await Support.findById(req.params.id);

    if (!support) {
      return res.status(404).json({ errorMessage: "Support not found" });
    }

    const data = {
      amount: req.body.amount || support.amount,
      isRecurring: req.body.isRecurring || support.isRecurring,
      firstName: req.body.firstName || support.firstName,
      middleName: req.body.middleName || support.middleName,
      lastName: req.body.lastName || support.lastName,
      suffix: req.body.suffix || support.suffix,
      email: req.body.email || support.email,
      country: req.body.country || support.country,
      address: req.body.address || support.address,
      city: req.body.city || support.city,
      state: req.body.state || support.state,
      postalCode: req.body.postalCode || support.postalCode,
      nameToRecognizeContribution: req.body.nameToRecognizeContribution || support.nameToRecognizeContribution,
      isTributeDonation: req.body.isTributeDonation || support.isTributeDonation,
      paymentMethod: req.body.paymentMethod || support.paymentMethod,
      cardNumber: req.body.cardNumber || support.cardNumber,
      cardName: req.body.cardName || support.cardName,
      password: hashedPassword || support.password,
    };

    support = await Support.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    return res.status(200).json({
      successMessage: "Support details was successfully updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errorMessage: "Something went wrong" });
  }
};
