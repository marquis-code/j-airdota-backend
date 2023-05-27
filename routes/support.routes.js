const { checkUser } = require("../middleware/auth.middleware");
const { Router } = require("express");
const {
  handle_new_support,
  get_all_supports,
  get_one_support,
  delete_support,
  update_support,
} = require("../controllers/support.controller");

const router = Router();

router.post("/", handle_new_support);

router.get("/", checkUser, get_all_supports);

router.get("/:id", checkUser, get_one_support);

router.delete("/:id", checkUser, delete_support);

router.put("/:id", checkUser, update_support);

module.exports = router;