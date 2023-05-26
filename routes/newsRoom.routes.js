const { checkUser } = require("../middleware/auth.middleware");
const { Router } = require("express");
const {
  handle_new_newsRoom,
  get_all_newsRooms,
  get_one_newsRoom,
  delete_newsRoom,
} = require("../controllers/newsRoom.controller");

const router = Router();

router.post("/", checkUser, handle_new_newsRoom);

router.get("/", get_all_newsRooms);

router.get("/:id", checkUser, get_one_newsRoom);

router.delete("/:id", checkUser, delete_newsRoom);

module.exports = router;
