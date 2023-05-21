const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user.models");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ errorMessage: "Something went wrong." });
      } else {
        next();
      }
    });
  } else {
    return res.status(401).json({ errorMessage: "Access denied" });
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jsonwebtoken.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ errorMessage: "Something went wrong." });
      }
      if (decodedToken.role !== 'admin') {
        return res.status(401).json({ errorMessage: "Access Denied. You need Admin role access." });
      }
      let user = await User.findById(decodedToken.id);
      res.locals.user = user;
      next();

    }
    );
  } else {
    return res.status(401).json({ errorMessage: "Access denied." });
  }
};

module.exports = { requireAuth, checkUser };
