const { checkUser } = require("../middleware/auth.middleware");
const { Router } = require("express");
const {
  handle_new_enquiry,
  get_all_enquires,
  get_one_enquiry,
  delete_enquiry,
} = require("../controllers/enquiry.controller");

const router = Router();

router.post("/", handle_new_enquiry);

router.get("/", checkUser, get_all_enquires);

router.get("/:id", checkUser,  get_one_enquiry);

router.delete("/:id", checkUser, delete_enquiry);

module.exports = router;