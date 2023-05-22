const { checkUser } = require("../middleware/auth.middleware");
const { Router } = require("express");
const upload = require("../utils/multer");
const {
    handle_new_publication,
    get_all_publications,
    get_one_publication,
    update_publication,
    delete_publication,
} = require("../controllers/publication.controller");

const router = Router();

router.post("/", upload.single("publicationImage"), handle_new_publication);

router.get("/", get_all_publications);

router.get("/:id", get_one_publication);

router.put("/:id", upload.single("publicationImage"), update_publication);

router.delete("/:id", delete_publication);

module.exports = router;
