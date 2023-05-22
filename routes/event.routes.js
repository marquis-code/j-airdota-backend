// const { checkUser } = require("../middleware/auth.middleware");
const { Router } = require("express");
const upload = require("../utils/multer");
const {
  handle_new_event,
  get_all_events,
  get_one_event,
  delete_event,
  update_event,
} = require("../controllers/event.controller");

const router = Router();

router.post("/", upload.single("eventImage"), handle_new_event);

router.get("/", get_all_events);

router.get("/:id", get_one_event);
router.put("/:id", upload.single("eventImage"), update_event);

router.delete("/:id", delete_event);

module.exports = router;
