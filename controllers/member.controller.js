const Member = require("../models/member.model");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Hurray! Welcome to AAIRTA Academy",
    link: "https://mailgen.js/",
    copyright: 'Copyright © 2024 AAIRTA. All rights reserved.',
  },
});

let mailtrapTransport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_AUTH_USER,
    pass: process.env.MAILTRAP_AUTH_PASSWORD
  },
});

module.exports.handle_new_member = async (req, res) => {
  try {
    const member = await Member.findOne({
      email: req.body.email,
    });
    if (member) {
      return res.status(404).json({
        errorMessage: `Member with Email ${req.body.email} already exist`,
      });
    }

    const emailMessage = {
      body: {
        greeting: 'Dear',
        signature: 'Sincerely',
        title: `Hello, ${req.body.firstName} ${req.body.lastName}`,
        intro: 'Thank you for showing interest in joining the AAIRTA Academy. We would revert back you shortly.',
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    var emailBody = MailGenerator.generate(emailMessage);
  
    const mailTrapMailOptions = {
      from: process.env.ACADEMY_AUTH_EMAIL, 
      to: req.body.email,
      subject: "Hurray! Welcome to AAIRTA Academy",
      html: emailBody,
    };

    const newMember = new Member({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      postalCode: req.body.postalCode,
      memberType: req.body.memberType,
      preferredContactMode: req.body.preferredContactMode
    });

    newMember
      .save()
      .then(() => {
        mailtrapTransport.sendMail(mailTrapMailOptions, function (err, info) {
          if(err){
            return res.status(500).json({
              errorMessage: err,
            })
          }else {
            return res
            .status(200)
            .json({ successMessage: 'Thanks for your interest in becoming a member of the AAIRTA team. We will revert shortly!' });
          }
        })
      })
      .catch((error) => {
        return res.status(500).json({
          errorMessage:
            "Something went wrong while saving Member. Please try again later",
        });
      });
  } catch (error) {
    return res.status(500).json({
      errorMessage: "Something went wrong. Please try again later",
    });
  }
};

module.exports.get_all_members = async (req, res) => {
  try {
    const members = await Member.find();
    if (!members) {
      return res.status(500).json({ errorMessage: "Members not available" });
    }
    return res.status(200).json(members);
  } catch (error) {
    return res.status(500).json({
      errorMessage:
        "Something went wrong while fetching Members. Please try again later",
    });
  }
};
module.exports.get_one_member = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid Member ID" });
  }
  try {
    const member = await Member.findById(_id);
    if (!member) {
      return res.status(404).json({ errorMessage: "Member does not exist" });
    }
    return res.status(200).json(member);
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again later." });
  }
};

module.exports.delete_member = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid Member ID" });
  }
  try {
    let member = await Member.findById(_id);
    await member.remove();
    return res.status(200).json({
      successMessage: "Member was successfully removed",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again." });
  }
};
