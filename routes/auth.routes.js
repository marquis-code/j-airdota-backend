const { Router } = require("express");
const {
  signup_handler,
  login_handler,
  logout_handler,
  reset_handler,
} = require("../controllers/auth.controller");

const router = Router();

router.post("/signup", signup_handler);

router.post("/login", login_handler);

router.get("/logout", logout_handler);

router.get("/reset-password", reset_handler);

module.exports = router;
