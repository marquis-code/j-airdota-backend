const { checkUser } = require("../middleware/auth.middleware");
const { Router } = require("express");
const {
  handle_new_member,
  get_all_members,
  get_one_member,
  delete_member
} = require("../controllers/member.controller");

const router = Router();

router.post("/signup", handle_new_member);

router.get("/", checkUser, get_all_members);

router.get("/:id", checkUser, get_one_member);

router.delete("/:id", checkUser, delete_member);

module.exports = router;