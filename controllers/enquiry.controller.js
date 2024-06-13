const Enquiry = require("../models/enquires.model.js");
const mongoose = require("mongoose");

module.exports.handle_new_enquiry = async (req, res) => {
  try {
    const user = await Enquiry.findOne({
      email: req.body.email,
    });
    if (user) {
      return res.status(404).json({ errorMessage: "Email already exist" });
    }

    const newEnquiry = new Enquiry({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        interest: req.body.interest,
        message: req.body.message
    });

    newEnquiry
      .save()
      .then(() => {
        return res
          .status(200)
          .json({ successMessage: "Enquiry was successfully created" });
      })
      .catch(() => {
        return res.status(500).json({
          errorMessage:
            "Something went wrong while saving enquiry. Please try again later",
        });
      });
  } catch (error) {
    return res.status(500).json({
      errorMessage: "Something went wrong. Please try again later",
    });
  }
};

module.exports.get_all_enquires = async (req, res) => {
  try {
    const enquires = await Enquiry.find();
    if (!enquires) {
      return res
        .status(500)
        .json({ errorMessage: "Enquires not available" });
    }
    return res.status(200).json(enquires);
  } catch (error) {
    return res.status(500).json({
      errorMessage:
        "Something went wrong while fetching enquires. Please try again later",
    });
  }
};
module.exports.get_one_enquiry = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid enquiry ID" });
  }
  try {
    const enquiry = await Enquiry.findById(_id);
    if (!enquiry) {
      return res
        .status(404)
        .json({ errorMessage: "Enquiry does not exist" });
    }
    return res.status(200).json(enquiry);
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again later." });
  }
};

module.exports.delete_enquiry = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid enquiry ID" });
  }
  try {
    let enquiry = await Enquiry.findById(_id);
    await enquiry.remove();
    return res.status(200).json({
      successMessage: "Enquiry was successfully removed",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again." });
  }
};