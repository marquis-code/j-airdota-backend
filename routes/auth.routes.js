const { Router } = require("express");
const {
  signup_handler,
  login_handler,
  logout_handler,
  reset_handler,
  request_reset_handler,
} = require("../controllers/auth.controller");

const router = Router();

router.post("/signup", signup_handler);

router.post("/login", login_handler);

router.get("/logout", logout_handler);

router.post("/password-reset", request_reset_handler);

router.post("/password-reset/:userId/:token", reset_handler);

module.exports = router;
