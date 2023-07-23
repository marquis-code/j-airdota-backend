const { checkUser } = require("../middleware/auth.middleware");
const { Router } = require("express");
const upload = require("../utils/multer");
const {
  handle_new_product,
  get_all_products,
  get_one_product,
  update_product,
  delete_product,
  get_published_products,
} = require("../controllers/product.controller");

const router = Router();

router.get("/published", get_published_products);

router.post("/", checkUser, upload.single("productImage"), handle_new_product);

router.get("/", get_all_products);

router.get("/:id", get_one_product);

router.put("/:id", checkUser, upload.single("productImage"), update_product);

router.delete("/:id", checkUser, delete_product);

module.exports = router;