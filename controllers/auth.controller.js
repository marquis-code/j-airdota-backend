const User = require("../models/user.models");
const Token = require("../models/token.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Subscription = require("../models/subscription.model");
const OTPVerification = require("../models/OTPVerification");
const sendEmail = require("../utils/sendEmail");
const Mailgen = require("mailgen");

// Generate email body using Mailgen
const MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "AAIRTA Team.",
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

const sendOTPVerificationEmail = async ({ _id, email, username }, res) => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const emailMessage = {
    body: {
      greeting: 'Dear',
      signature: 'Sincerely',
      title: `Hello, ${username}`,
      intro: `We recieved a request to access your AAIRTA Account ${email} through your email address. Your One Time OTP verification code is: ${otp}`,
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
  var emailBody = MailGenerator.generate(emailMessage);

  const mailTrapMailOptions = {
    from: process.env.ACADEMY_AUTH_EMAIL, 
    to: email,
    subject: "AAIRTA Email Verification Code (One Time Password)", // Subject line
    html: emailBody,
  };

  mailtrapTransport.sendMail(mailTrapMailOptions, async function (err, info) {
    if (err) {
      console.log(err);
    } else {
      const saltRounds = 10;
      const hashedOtp = await bcrypt.hash(otp, saltRounds);
      const newOTPVerification = await new OTPVerification({
        userId: _id,
        otp: hashedOtp,
        expiresAt: Date.now() + 1800000,
        createdAt: Date.now(),
      });
      await newOTPVerification.save();
      return res.status(200).json({
        successMessage: "Verification otp email sent.",
        data: { userId: _id, email },
      });
    }
  });
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
    const { username, email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errorMessage: "User Already Exist" });
    }

    const newAdminUser = new User({
      username,
      email,
      password,
      role,
      verified: false,
    });

    newAdminUser
      .save()
      .then((result) => {
        sendOTPVerificationEmail(result, res);
      })
      .catch((error) => {
        return res.json({
          errorMessage:
            "Something went wrong, while saving admin user account, please try again.",
        });
      });
  } catch (error) {
    return res.json({
      errorMessage:
        "Something went wrong, while saving admin user account, please try again.",
    });
  }
};

module.exports.login_handler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errorMessage: "Invalid credentials!" });
    }
    let auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ errorMessage: "Invalid credentials!" });
    }

    sendOTPVerificationEmail(user, res);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
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

module.exports.handle_otp_verification = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      return res.status(400).json({
        errorMessage: "Empty OTP details are not allowed.",
      });
    } else {
      const userOTPVerificationRecords = await OTPVerification.find({
        userId,
      });

      if (userOTPVerificationRecords.length <= 0) {
        return res.status(400).json({
          errorMessage:
            "Account record doesn't exist or has been verified already. Please signup or log in",
        });
      } else {
        const { expiresAt } = userOTPVerificationRecords[0];
        const hashedOtp = userOTPVerificationRecords[0].otp;

        if (expiresAt < Date.now()) {
          await OTPVerification.deleteMany({ userId });
          return res.status(400).json({
            errorMessage: "Code has expired. Please request again.",
          });
        } else {
          const validOtp = await bcrypt.compare(otp, hashedOtp);

          if (!validOtp) {
            return res.status(400).json({
              errorMessage: "Invalid code passed. Check your inbox.",
            });
          } else {
            await User.updateOne({ _id: userId }, { verified: true });
            await OTPVerification.deleteMany({ userId });
            const user = await User.findOne({ _id: userId });

            const token = createToken(user._id, user.role);
            res.cookie("jwt", token, {
              maxAge: maxAge * 1000,
              httpOnly: true,
              secure: true,
            });

            return res.status(200).json({
              user: {
                username: user.username,
                email: user.email,
                role: user.role,
              },
              successMessage: "You are now logged in.",
              accessToken: token,
            });
            // return res.status(200).json({
            //   successMessage: "Email has been verified.",
            //   data: { userId },
            // });
          }
        }
      }
    }
  } catch (error) {
    return res.status(500).json({
      errorMessage: error.message,
    });
  }
};

module.exports.handle_resend_otp_verification = async (req, res) => {
  try {
    const { userId, email } = req.body;
    if (!userId || !email) {
      return res.status(400).json({
        errorMessage: "Empty user details are not allowed.",
      });
    } else {
      await OTPVerification.deleteMany({ userId });
      sendOTPVerificationEmail({ _id: userId, email }, res);
    }
  } catch (error) {
    return res.status(500).json({
      errorMessage: error.message,
    });
  }
};

module.exports.handle_subscription = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await Subscription.findOne({ email });

    if (user) {
      return res.status(404).json({
        errorMessage: "You have already subscribed to our email service",
      });
    }

    const emailOptions = {
      to: email,
      from: process.env.AUTH_EMAIL,
      subject: `Thanks for subscribing to AAIRTA`,
      html: `
            <div style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);  border-radius: 25px; padding: 10px">
              <h4>Thank you for subscribing to our newsletter.</h4>
              <p>Your subscription has been confirmed.</p
              <p>If at anytime you wish to stop recieving our newsletter, you can click the Unsubscribe link in the bottom of the news letter</p>
              <p>If you have any questions about AAIRTA, contact us via the following emails:
               <p>aairta@gmail.com</p>
              <p>isholawilliams@gmail.com</p>
              <p>Sincerely,</p>
              <p>Thank you again!</p>
            </div>
            `,
    };

    const newUser = new Subscription({
      email,
    });

    await newUser.save();
    await transporter.sendMail(emailOptions);
    return res.status(200).json({
      successMessage: "Thanks for subscribing.",
    });
  } catch (error) {
    return res.status(500).json({
      errorMessage: "SOMETHING WENT WRONG. PLEASE TRY AGAIN",
    });
  }
};
