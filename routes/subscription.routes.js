// const { checkUser } = require("../middleware/auth.middleware");
const { Router } = require("express");
const {
  handle_new_subscription,
  get_all_subscriptions,
  get_one_subscription,
  delete_subscription,
} = require("../controllers/subscription.controller");

const router = Router();

router.post("/", handle_new_subscription);

router.get("/", get_all_subscriptions);

router.get("/:id", get_one_subscription);

router.delete("/:id", delete_subscription);

module.exports = router;
