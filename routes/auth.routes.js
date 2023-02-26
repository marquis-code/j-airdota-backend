const { Router } = require("express");
const {
  signup_handler,
  login_handler,
  logout_hadler,
} = require("../cotrollers/auth.controller");

const router = Router();

router.post("/signup", signup_handler);

router.post("/login", login_handler);

router.get("/logout", logout_hadler);

module.exports = router;
